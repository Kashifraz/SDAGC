import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('Strengo.db');

/* 
Any code regarding await and async in initDatabase is referenced from Github Copilot:
[Github Copilot: 28/02/2024; 
Asked: "@workspace After initialising the database and inserting a test data in index.jsx. 
Why is the only data that is printed to console that test data, 
not actually any of the workouts in the database init method?",

"So what is the await doing?",

"You placed the resolve() and reject(error) at the end of the first executeSql in initDatabase. 
Should I not place those in the last executeSql statement instead? 
Where the workouts are inserted? Line 53"]

Only the use of promises in initDatabase is directly from Copilot, 
the rest of the promise work is written by me.
*/


const databaseHelper = {
  

  /**
   * Initializes the database by creating necessary tables and inserting initial data.
   * @returns {Promise} A promise that resolves if the initialization is successful, and rejects if there is an error.
   */
  initDatabase: () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {

        /*
        The 3 SQL statements below are used to delete the tables if they already exist,
        and then create them again.
        This is because restarting the app does not clear the database.
        Each error is caught and logged to the console. A reject() is also called to reject the promise.
        A resolve() is called at the end of the last executeSql statement in the callback to resolve the promise.
        */

        tx.executeSql(
          "DROP TABLE IF EXISTS Workouts", 
          [], 
          (tx, ResultSet) => {console.log("Workouts table deleted")}, 
          (tx, error) => {console.warn("Error deleting table, table might not already exist"); reject(error);});

        tx.executeSql(
          "DROP TABLE IF EXISTS Templates", 
          [], 
          (tx, ResultSet) => {console.log("Templates table deleted")}, 
          (tx, error) => {console.warn("Error deleting table, table might not already exist"); reject(error);});

        tx.executeSql(
          "CREATE TABLE IF NOT EXISTS Workouts (workoutId INTEGER PRIMARY KEY AUTOINCREMENT, workoutName TEXT, type TEXT)", 
          [], 
          (tx, ResultSet) => {console.log("Workouts table created")},
          (tx, error) => {console.warn("Error creating table"); reject(error);}
          );

        tx.executeSql(
          "DROP TABLE IF EXISTS operatingValues",
          [],
          (tx, ResultSet) => {console.log("operatingValues table deleted")},
          (tx, error) => {console.warn("Error deleting table, table might not already exist"); reject(error);}
          );

        tx.executeSql("DROP TABLE IF EXISTS WorkoutHistory",
          [],
          (tx, ResultSet) => {console.log("WorkoutHistory table deleted")},
          (tx, error) => {console.warn("Error deleting table, table might not already exist"); reject(error);}
          );

        tx.executeSql("CREATE TABLE IF NOT EXISTS WorkoutHistory (id INTEGER PRIMARY KEY AUTOINCREMENT, templateId INTEGER, date TEXT, weight INTEGER, reps INTEGER, sets INTEGER, workoutId INTEGER, FOREIGN KEY (templateId) REFERENCES Templates(templateId), FOREIGN KEY (workoutId) REFERENCES Workouts(workoutId))",
          [],
          (tx, ResultSet) => {console.log("WorkoutHistory table created")},
          (tx, error) => {console.warn("Error creating table"); reject(error);}
          );

        /*
        workoutNames and workoutTypes are both generate by Github Copilot.
        This was to save time on typing out the names of the workouts and types.
        */
        const workoutNames = [
          "Push-ups",
          "Squats",
          "Plank",
          "Bicep Curls",
          "Lunges",
          "Deadlifts",
          "Bench Press",
          "Crunches",
          "Shoulder Press",
          "Leg Press",
          "Pull-ups",
          "Chest Flies",
          "Russian Twists",
          "Tricep Dips",
          "Calf Raises",
          "Sit-ups",
          "Leg Raises",
        ];

        const workoutTypes = [
          "Core",
          "Arms",
          "Shoulders",
          "Legs",
          "Back",
          "Chest"
        ];

        /*
        The below lines are also Github Copilot generated.
        This was to save time on typing out the insertWorkout statements.
        */
        databaseHelper.insertWorkout(workoutNames[0], workoutTypes[5]);
        databaseHelper.insertWorkout(workoutNames[1], workoutTypes[3]);
        databaseHelper.insertWorkout(workoutNames[2], workoutTypes[0]);
        databaseHelper.insertWorkout(workoutNames[3], workoutTypes[1]);
        databaseHelper.insertWorkout(workoutNames[4], workoutTypes[3]);
        databaseHelper.insertWorkout(workoutNames[5], workoutTypes[4]);
        databaseHelper.insertWorkout(workoutNames[6], workoutTypes[5]);
        databaseHelper.insertWorkout(workoutNames[7], workoutTypes[0]);
        databaseHelper.insertWorkout(workoutNames[8], workoutTypes[2]);
        databaseHelper.insertWorkout(workoutNames[9], workoutTypes[3]);
        databaseHelper.insertWorkout(workoutNames[10], workoutTypes[4]);
        databaseHelper.insertWorkout(workoutNames[11], workoutTypes[5]);
        databaseHelper.insertWorkout(workoutNames[12], workoutTypes[0]);
        databaseHelper.insertWorkout(workoutNames[13], workoutTypes[1]);
        databaseHelper.insertWorkout(workoutNames[14], workoutTypes[3]);
        databaseHelper.insertWorkout(workoutNames[15], workoutTypes[0]);
        databaseHelper.insertWorkout(workoutNames[16], workoutTypes[0]);

        
        /*
        The below code creates the Templates table.
        The callback has the resolve() function to resolve the promise as it is the last executeSql statement.
        If there is an error, the reject() function is called to reject the promise.
        */

          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS Templates (templateId INTEGER, templateName TEXT, workoutId INTEGER, weight INTEGER, reps INTEGER, sets INTEGER, isDefault BOOL, FOREIGN KEY (workoutId) REFERENCES Workouts(id))",
            [],
            (tx, ResultSet) => { console.log("Templates table created"); },
            (tx, error) => { console.warn("Error creating Templates table"); reject(error); }
          );

          tx.executeSql(
            "CREATE TABLE IF NOT EXISTS operatingValues (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, value BOOLEAN)",
            [],
            (tx, ResultSet) => { console.log("operatingValues table created"); resolve(); },
            (tx, error) => { console.warn("Error creating operatingValues table"); reject(error); }
          );

          databaseHelper.insertOperatingValue("dbInit", 1);
          databaseHelper.insertOperatingValue("templatesInit", 0);

      });
    });
  },

  /*
  Takes in a name and type, and inserts a new workout into the Workouts table.
  The promise is resolved if the workout is inserted successfully, and rejected if there is an error.
  */
  insertWorkout: (workoutName, type) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => { 
        tx.executeSql(
          "INSERT INTO Workouts (workoutName, type) VALUES (?, ?)", 
          [workoutName, type], 
          (tx, ResultSet) => { console.log(workoutName + " " + type + " inserted"); resolve(); },
          (tx, err) => { console.warn("Error inserting workout", err); reject(err); }
        );
      });
    });
  },

  /*
  Takes in an id, name, workoutId, weight, reps, sets, and isDefault, and inserts a new workout template into the Templates table.
  The promise is resolved if the template is inserted successfully, and rejected if there is an error.
  */
  insertWorkoutTemplate: (templateId, templateName, workoutId, weight, reps, sets, isDefault) => {
    return new Promise((resolve, reject) => { 
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT OR IGNORE INTO Templates (templateId, templateName, workoutId, weight, reps, sets, isDefault) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [templateId, templateName, workoutId, weight, reps, sets, isDefault],
          (tx, ResultSet) => { console.log("Template inserted"); resolve(); },
          (tx, error) => { console.warn("Error inserting template", error); reject(error); }
        )
      })
    });
  },

  /*
  [Github Copilot: 28/02/2024; Asked: "How would I make the db readable in console?"]
  Code regarding the reading of the database and promises is written by me.
  String manipulation and JSON.stringify is used to make the data readable in the console, this is from Copilot.
  */
  readDb: (table = "", id = "") => {
    return new Promise((resolve, reject) => {
      if (table === "" && id === "") {
        db.transaction((tx) => {
          tx.executeSql(
            "SELECT * FROM Workouts",
            [],
            (_, { rows: { _array } }) => {console.log("Reading Workouts table", JSON.stringify(_array, null, 2));},
            (_, error) => {console.log("Error reading workouts table => readDb");reject(error);}
          ),
          tx.executeSql(
            "SELECT * FROM Templates",
            [],
            (_, { rows: { _array } }) => {console.log("Reading Templates table", JSON.stringify(_array, null, 2)); resolve();},
            (_, error) => {console.log("Error reading templates table => readDb");reject(error);}
          ),
          tx.executeSql("SELECT * FROM operatingValues",
            [],
            (_, { rows: { _array } }) => {console.log("Reading operatingValues table", JSON.stringify(_array, null, 2));},
            (_, error) => {console.log("Error reading operatingValues table => readDb");reject(error);}
          ),
          tx.executeSql("SELECT * FROM WorkoutHistory",
            [],
            (_, { rows: { _array } }) => {console.log("Reading WorkoutHistory table", JSON.stringify(_array, null, 2));},
            (_, error) => {console.log("Error reading WorkoutHistory table => readDb");reject(error);}
          );
        });
      }
    });
},

  /*
  I created a seperate function to read from the Templates table with a custom SQL query rather than
  using if statements in the readDb function.
  This is because the readDb function is already quite long, and I wanted to keep it as clean as possible.
  I also wanted to reduce complexity and make the code more readable.
  This function takes in a custom SQL query, and reads from the Templates table.
  */
  readTemplates: (SQLquery = "", ...args) => {
    return new Promise((resolve, reject) => {
      if (SQLquery === "") {
        reject("No SQL query provided");

      } else { 

        /*
        The JSON parsing in the resolve() function is from Github Copilot.
        [Github Copilot: 01/03/2024; 
        Asked: "@workspace If I hover over item, it says that item: never. 
        Also the hardcoded data did work. 
        Here is my readtemplate function aswell. readTemplates:...",

        "Could I do this within the readtemplates function?"]
        */
       //console.log("Reading from Templates table with SQLquery \n" + SQLquery, JSON.stringify(_array, null, 2)); 

        db.transaction((tx) => {
        tx.executeSql(
          SQLquery,
          args,
          (_, { rows: { _array } }) => {resolve(JSON.parse(JSON.stringify(_array, null, 2))); console.log("Reading from Templates table with SQLquery \n" + SQLquery, JSON.stringify(_array, null, 2));},
          (_, error) => {reject(error);}
        );
      });
    }
    });
  },
  
  readOperatingValues: (SQLquery = "", ...args) => {
    return new Promise((resolve, reject) => {
      if (SQLquery === "") {
        reject("No SQL query provided");
      } else {
        db.transaction((tx) => {
          tx.executeSql(
            SQLquery,
            args,
            (_, { rows: { _array } }) => {console.log("Reading from operatingValues table with SQLquery \n" + SQLquery, JSON.stringify(_array, null, 2));resolve(JSON.parse(JSON.stringify(_array, null, 2)));},
            (_, error) => {reject(error);}
          );
        });
      }
    });
  },

  insertOperatingValue: (name, value) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "INSERT OR IGNORE INTO operatingValues (name, value) VALUES (?, ?)",
          [name, value],
          (tx, ResultSet) => {console.log("Operating value inserted"); resolve();},
          (tx, error) => {console.warn("Error inserting operating value", error); reject(error);}
        );
      });
    });
  },

  customQuery: (SQLquery = "", ...args) => {
    return new Promise((resolve, reject) => {
      if (SQLquery === "") {
        reject("No SQL query provided");
      } else {
        db.transaction((tx) => {
          tx.executeSql(
            SQLquery,
            args,
            (_, { rows: { _array } }) => {console.log("Custom query executed with SQLquery \n" + SQLquery, JSON.stringify(_array, null, 2));resolve(JSON.parse(JSON.stringify(_array, null, 2)));},
            (_, error) => {reject(error); console.log("Error executing custom query", error);}
          );
        });
      }
    });
  }
};


export default databaseHelper;