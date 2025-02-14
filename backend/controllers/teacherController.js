// controllers/teachersController.js
const { teachersPool } = require("../config/database");
const ExcelJS = require("exceljs");
const path = require("path");
const cors = require('cors');
const bodyParser = require('body-parser');
const express = require("express");
const nodemailer = require('nodemailer');
require("dotenv").config();
const app = express();
const crypto = require('crypto');
const secretKey = crypto.randomBytes(32).toString('hex');
const { setUserId } = require("../service/auth");
const jwt = require("jsonwebtoken");

const { setUser } = require("../service/auth");

app.use(bodyParser.json());
const TOKEN_EXPIRATION = '1h';
const fetchTeacherData = async (req, res) => {
  const { tableName } = req.params;
  console.log(tableName);

  try {
    // Check if the table already exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'inhouse_teachers'
        AND table_name = '${tableName}'
      ) AS table_exists;
    `;

    const result = await teachersPool.query(checkTableQuery);
    const tableExists = result[0][0].table_exists;

    if (tableExists) {
      // Table exists, check if it's empty
      const checkEmptyTableQuery = `SELECT COUNT(*) AS row_count FROM ${tableName}`;
      const rowCountResult = await teachersPool.query(checkEmptyTableQuery);
      const rowCount = rowCountResult[0][0].row_count;

      if (rowCount === 0) {
        // Table is empty, send notification
        return res.status(200).send([]);
      } else {
        // Table is not empty, fetch data
        const fetchDataQuery = `SELECT * FROM ${tableName}`;
        const tableData = await teachersPool.query(fetchDataQuery);
        return res.status(200).send(tableData[0]);
      }
    } else {
      // Table doesn't exist, create table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          \`Serial No\` INT AUTO_INCREMENT PRIMARY KEY ,
          \`Email ID\` VARCHAR(50) ,
          \`Subject\` VARCHAR(255),
          \`Division\` INT,
          \`Coordinator\` VARCHAR(255)
        )
      `;
      await teachersPool.query(createTableQuery);
    }
  } catch (error) {
    console.error("Error creating, fetching, or linking table:", error);
    return res.status(500).send('Internal Server Error');
  }
}
const createAndLinkTable = async (req, res) => {
  const { tableName } = req.params;
  console.log(tableName);

  try {
    // Check if the table already exists
    const checkTableQuery = `
      SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'inhouse_teachers'
        AND table_name = '${tableName}'
      ) AS table_exists;
    `;

    const result = await teachersPool.query(checkTableQuery);
    const tableExists = result[0][0].table_exists;

    if (tableExists) {
      // Table exists, check if it's empty
      const checkEmptyTableQuery = `SELECT COUNT(*) AS row_count FROM ${tableName}`;
      const rowCountResult = await teachersPool.query(checkEmptyTableQuery);
      const rowCount = rowCountResult[0][0].row_count;

      if (rowCount === 0) {
        // Table is empty, send notification
        return res.status(200).send([]);
      } else {
        // Table is not empty, fetch data
        const fetchDataQuery = `SELECT * FROM ${tableName}`;
        const tableData = await teachersPool.query(fetchDataQuery);
        return res.status(200).send(tableData[0]);
      }
    } else {
      // Table doesn't exist, create table
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${tableName} (
          \`Serial No\` INT AUTO_INCREMENT PRIMARY KEY ,
          \`Email ID\` VARCHAR(50) ,
          \`Subject\` VARCHAR(255),
          \`Division\` INT,
          \`Coordinator\` VARCHAR(255)
        )
      `;
      await teachersPool.query(createTableQuery);

      // Link the tables using a foreign key constraint on the email column
      const linkTablesQuery = `
        ALTER TABLE ${tableName}
        ADD FOREIGN KEY (\`Email ID\`)
        REFERENCES teacherdata(\`Email ID\`)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
      `;

      await teachersPool.query(linkTablesQuery);

      return res.status(200).send('Table created and linked successfully.');
    }
  } catch (error) {
    console.error("Error creating, fetching, or linking table:", error);
    return res.status(500).send('Internal Server Error');
  }
};

const uploadExcelTeachers = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const { tableName } = req.params;

    const excelFile = req.files.file;
    const fileName = excelFile.name;

    // Save the file to a temporary location
    const filePath = path.join(__dirname, fileName);
    await excelFile.mv(filePath);
    console.log(filePath, tableName);

    // Call the function to process the Excel file
    const result = await excelToMySQLArrayTeachers(filePath, tableName);

    if (result && result.error && result.error.includes("Duplicate entry")) {
      return res.status(400).send("Duplicate entries not allowed");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }
};

async function excelToMySQLArrayTeachers(filePath, tableName) {
  try {
    // Load the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);
    console.log(tableName);

    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);

    // Define the MySQL table structure
    const columns = [
      "Serial No",
      "Email ID",
      "Subject",
      "Division",
      "Coordinator"
    ];

    // Initialize array to store data
    const dataArray = [];

    // Iterate through rows and convert to objects
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        // Skip the header row
        const rowData = {};

        // Populate rowData dynamically
        columns.forEach((colName, index) => {
          const cellValue = row.getCell(index + 1).value;
          rowData[colName] = cellValue;
        });

        // Push rowData to dataArray
        dataArray.push(rowData);
      }
    });

    // Insert data into the MySQL table
    if (dataArray.length > 0) {
      const placeholders = columns.map(() => "?").join(", ");

      const values = dataArray.map((rowData) =>
        columns.map((col) => {
          // Extracting only the text property from 'Email ID' objects
          if (col === 'Email ID' && typeof rowData[col] === 'object') {
            return rowData[col].text;
          } else {
            return rowData[col];
          }
        })
      );

      // Debugging: Print values array
      console.log("Values Array:", values);

      // Execute the SQL INSERT query
      try {
        await teachersPool.execute(
          `INSERT INTO ${tableName} (\`${columns.join("`, `")}\`) VALUES ${values
            .map(() => `(${placeholders})`)
            .join(", ")}`,
          values.flat()
        );
        console.log("Data inserted into MySQL table.");
      } catch (error) {
        // Check for MySQL error code indicating duplicate entry
        if (error.code === 'ER_DUP_ENTRY') {
          console.log("Duplicate entry not allowed");
          return { error: "Duplicate entry not allowed" };
        } else {
          throw error; // Rethrow other errors
        }
      }
    } else {
      console.log("No data to insert.");
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "An error occurred while processing the Excel file." };
  }
}

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const sql = 'SELECT EXISTS (SELECT 1 FROM teacherdata WHERE `Email ID` = ? AND Password = ?) AS user_exists';
    const result = await teachersPool.query(sql, [email, password]);
    const sql2 = 'SELECT name FROM teacherdata WHERE `Email ID` = ? AND Password = ?';
    const result2 = await teachersPool.query(sql2, [email, password]);
    const sql3 = 'SELECT * FROM teacherdata WHERE `Email ID` = ? AND Password = ?';
    const user1 = await teachersPool.query(sql3, [email, password]);

    if (result[0][0]['user_exists'] == 1) {
      const user = user1[0][0];
      res.status(200).json({ email: user['Email ID'], department: user.Department, role: user.Role, name: user.name });
    }
    else if (result[0][0]['user_exists'] == 0) {
      return res.status(401).send("Invalid Credentials!");
    }
  }
  catch (error) {
    console.log(error);
  }
}

const uploadMainTable = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send("No files were uploaded.");
    }

    const excelFile = req.files.file;
    const fileName = excelFile.name;

    // Save the file to a temporary location
    const filePath = path.join(__dirname, fileName);
    await excelFile.mv(filePath);


    // Call the function to process the Excel file
    const result = await excelToMySQLArrayMainTable(filePath);

    if (result && result.error && result.error.includes("Duplicate entry")) {
      return res.status(400).send("Duplicate entries not allowed");
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error:", error);
    res.sendStatus(500);
  }

}

async function excelToMySQLArrayMainTable(filePath) {
  try {
    // Load the Excel file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);


    // Get the first worksheet
    const worksheet = workbook.getWorksheet(1);

    // Define the MySQL table structure
    const columns = [
      "Serial No",
      "Email ID",
      "Password",
      "Name",
      "Master"
    ];

    // Initialize array to store data
    const dataArray = [];

    // Iterate through rows and convert to objects
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber !== 1) {
        // Skip the header row
        const rowData = {};

        // Populate rowData dynamically
        columns.forEach((colName, index) => {
          const cellValue = row.getCell(index + 1).value;
          rowData[colName] = cellValue;
        });

        // Push rowData to dataArray
        dataArray.push(rowData);
      }
    });

    // Insert data into the MySQL table
    if (dataArray.length > 0) {
      const placeholders = columns.map(() => "?").join(", ");

      const values = dataArray.map((rowData) =>
        columns.map((col) => {
          // Extracting only the text property from 'Email ID' objects
          if (col === 'Email ID' && typeof rowData[col] === 'object') {
            return rowData[col].text;
          } else {
            return rowData[col];
          }
        })
      );

      // Debugging: Print values array
      console.log("Values Array:", values);

      // Execute the SQL INSERT query
      try {
        await teachersPool.execute(
          `INSERT INTO teacherdata (\`${columns.join("`, `")}\`) VALUES ${values
            .map(() => `(${placeholders})`)
            .join(", ")}`,
          values.flat()
        );
        console.log("Data inserted into MySQL table.");
      } catch (error) {
        // Check for MySQL error code indicating duplicate entry
        if (error.code === 'ER_DUP_ENTRY') {
          console.log("Duplicate entry not allowed");
          return { error: "Duplicate entry not allowed" };
        } else {
          throw error; // Rethrow other errors
        }
      }
    } else {
      console.log("No data to insert.");
    }
  } catch (error) {
    console.error("Error:", error);
    return { error: "An error occurred while processing the Excel file." };
  }
};

//-------------------------------------------------------------------------------------------------------

const otpStorage = []; // Assuming otpStorage is declared globally or appropriately
const resendAttempts = {}; // Track resend attempts per user

// Function to generate and send OTP with timestamp
const generateAndSendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const timestamp = Date.now();

  otpStorage[email] = {
    otp,
    timestamp,
  };
  console.log(otpStorage);

  // Send the OTP to the user (send email, SMS, etc.)
  console.log(`OTP sent to ${email}: ${otp}`);

  return timestamp; // Return the timestamp for expiration tracking
}

// Function to track resend attempts
function trackResendAttempt(email) {
  if (!resendAttempts[email]) {
    resendAttempts[email] = 1;
  } else {
    resendAttempts[email]++;
  }
  return resendAttempts[email];
}


// Nodemailer setup (use your own SMTP details)
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'wildlifewondersunveiled@gmail.com',
    pass: 'ialjcgryxzvcecgs',
    // type: 'OAuth2',
  },
});

const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const sql = 'SELECT EXISTS (SELECT 1 FROM teacherdata WHERE `Email ID` = ?) AS user_exists';
    const result = await teachersPool.query(sql, [email]);
    console.log(result[0][0]['user_exists']);

    if (result[0][0]['user_exists'] == 1) {
      const timestamp = generateAndSendOtp(email);
      console.log(timestamp);

      // Reset resend attempts counter when generating a new OTP
      resendAttempts[email] = 0;

      const mailOptions = {
        from: 'wildlifewondersunveiled@gmail.com',
        to: email,
        subject: 'Password Reset OTP',
        html: `<!DOCTYPE html>
        <html lang="en">
        
        <head>
            <meta charset="UTF-8">
            <title>Password Reset OTP</title>
        
        
        </head>
        
        <body>
        
            <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">CO PO
                            Attainment</a>
                    </div>
                    <p style="font-size:1.1em">Hi,</p>
                    <p>Thank you for choosing CO PO Solutions. Use the following OTP to complete your Password Recovery
                        Procedure.
                        OTP is valid for 10 minutes</p>
                    <h2
                        style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
                        ${otpStorage[email].otp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />CO PO Solutions</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>SCTR'S Pune Institute Of Computer Technology</p>
                        <p>Dhankawadi-411043</p>
                        <p>Pune</p>
                    </div>
                </div>
            </div>
        
        
        </body>
        
        </html>`,

      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send("Failed to send OTP. Please try again.");
        } else {
          console.log('Email sent: ' + info.response);
          res.status(200).send("OTP sent to your email address.");
        }
      });
    } else if (result[0][0]['user_exists'] == 0) {
      return res.status(400).send("Email doesn't exist!");
    }
  } catch (error) {
    console.log("error: ", error);
  }
};


const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  const Email = email;
  const storedOtpData = otpStorage[Email];

  try {
    if (storedOtpData.otp != otp) {
      return res.status(401).send("Invalid OTP");
    }
    const expirationTime = 10 * 60 * 1000; // 10 minutes in milliseconds
    if (Date.now() - storedOtpData.timestamp > expirationTime) {
      return res.status(500).send("OTP has expired");
    }



    res.status(200).send("OTP verified successfully.");
    delete otpStorage[email];
  }
  catch (error) {
    console.log("error:", error);
  }

}

const resendOTP = async (req, res) => {
  const { email } = req.body;

  // Check resend attempts and limit to 5 per day
  const attempts = trackResendAttempt(email);
  if (attempts > 5) {
    return res.status(429).send("Exceeded maximum resend attempts for the day.");
  }

  const timestamp = generateAndSendOtp(email);

  res.status(200).send("OTP resent successfully.");

}

// const resetPassword = async (req, res) => {
//   const { email, password } = req.body;
//   console.log(password);
//   console.log(email);
//   try {
//     const sql = 'UPDATE teacherdata SET `Password` = ? WHERE `Email ID` = ?';
//     const result = await teachersPool.query(sql, [password, email]);
//     if (result[0]['affectedRows'] == 1) {
//       res.status(200);
//     }
//     else if (result[0]['affectedRows'] == 0) {
//       res.status(500);
//     }
//   }
//   catch (error) {
//     console.log("error: ", error);
//   }

// }
const resetPassword = async (req, res) => {
  const { email, password } = req.body;
  console.log(password);
  console.log(email);
  try {
    const sql = 'UPDATE teacherdata SET `Password` = ? WHERE `Email ID` = ?';
    const result = await teachersPool.query(sql, [password, email]);
    // console.log(result)
    if (result[0]['affectedRows'] !== 0) {
      console.log("in chanfge")
      res.status(200).json({ success: true, message: "Password reset successfully." });
    } else if (result[0]['affectedRows'] === 0) {
      res.status(500).json({ success: false, message: "An error occurred while resetting the password." });
    }
    console.log("first")
  }
  catch (error) {
    console.log("error: ", error);
    res.status(500).json({ success: false, message: "An error occurred while resetting the password." });
  }
}


const updateTeacherSubjects = async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const data = req.body;
    console.log("in backend")

    // Delete all existing data from the table
    await teachersPool.query(`DELETE FROM ${tableName}`);

    // Insert new data into the table
    // Assuming data is an array of objects containing the rows to be inserted
    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const keys = Object.keys(rowData);
      const values = keys.map(key => rowData[key]);
      const placeholders = keys.map(() => '?').join(',');
      const escapedColumns = keys.map(key => `\`${key}\``).join(',');
      const query = `INSERT INTO ${tableName} (${escapedColumns}) VALUES (${placeholders})`;
      await teachersPool.query(query, values);
    }

    res.status(200).send("Teacher subjects updated successfully");
  } catch (error) {
    console.error("Error in updating teacher subjects:", error);
    res.status(500).send("Internal Server Error");
  }
};
const updateTeacherData = async (req, res) => {
  try {
    const tableName = req.params.tableName;
    const data = req.body;
    console.log(data)

    // Delete all existing data from the table
    await teachersPool.query(`DELETE FROM ${tableName}`);

    // Insert new data into the table
    // Assuming data is an array of objects containing the rows to be inserted
    for (let i = 0; i < data.length; i++) {
      const rowData = data[i];
      const keys = Object.keys(rowData);
      const values = keys.map(key => rowData[key]);
      const placeholders = keys.map(() => '?').join(',');
      const escapedColumns = keys.map(key => `\`${key}\``).join(',');
      const query = `INSERT INTO ${tableName} (${escapedColumns}) VALUES (${placeholders})`;
      await teachersPool.query(query, values);
    }

    res.status(200).send("Teacher subjects updated successfully");
  } catch (error) {
    console.error("Error in updating teacher subjects:", error);
    res.status(500).send("Internal Server Error");
  }
}
//--------------------------------------------------------------------------------------
const getSubjectsAndDivisions = async (req, res) => {
  const { email, dataTableName } = req.params;
  // console.log(email, "   ", dataTableName);

  try {
    // Fetch subjects and divisions associated with the logged-in teacher's email
    const getSubjectsAndDivisionsQuery = `SELECT ${dataTableName}.Subject, ${dataTableName}.Division, ${dataTableName}.Coordinator
    FROM ${dataTableName}
    JOIN teacherdata ON ${dataTableName}.\`Email ID\` = teacherdata.\`Email ID\`
    WHERE teacherdata.\`Email ID\` = '${email}'
    `;
    const results = await teachersPool.query(getSubjectsAndDivisionsQuery, [email]);
    // console.log("Results: ",results[0]);
    if (results && results.length > 0) {
      // // Extract subjects, divisions, and coordinators
      // const dataRows = results[0];
      // const subjectDivisionCoordinator = {};

      // // Construct object with subject:division:coordinator
      // dataRows.forEach(row => {
      //   const { Subject, Division, Coordinator } = row;
      //   if (!subjectDivisionCoordinator[Subject]) {
      //     subjectDivisionCoordinator[Subject] = {};
      //   }
      //   subjectDivisionCoordinator[Subject][Division] = Coordinator;
      // });

      // // Print or send the subjects, divisions, and coordinators
      // console.log('Subject-Division-Coordinator:', subjectDivisionCoordinator);

      // Send the subjects, divisions, and coordinators as JSON
      res.json(results[0]);
    }

  } catch (error) {
    console.log("Error occurred: ", error);
  }
}


const getSubjectAsPerAllotmaint = async (req, res) => {
  try {
    const { subjectTableName, email } = req.params;
    const query = `slect Subject from ${subjectTableName} where \`Email ID\`==${email}`;
    const result = await teachersPool.query(query);
  } catch (error) {
    res.send({ message: "Internal server error" });
  }
}





//-------------------------------------------------------------------------------------


module.exports = { updateTeacherData, updateTeacherSubjects, createAndLinkTable, uploadExcelTeachers, uploadMainTable, login, forgotPassword, verifyOTP, resendOTP, resetPassword, getSubjectsAndDivisions, fetchTeacherData };
