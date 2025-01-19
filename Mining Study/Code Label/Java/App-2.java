package edu.lehigh.cse216.knights.admin;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

import java.util.ArrayList;
import java.util.Map;

import com.google.gson.Gson;

/**
 * App is our basic admin app.  For now, it is a demonstration of the six key 
 * operations on a database: connect, insert, update, query, delete, disconnect
 */
public class App {

    /** Database object to communicate with the PostgreSQL database. */
    static Database db;

    /** Defaut port to access PostgreSQL database with. Can be specified by using
     * detailed environment variables for database setup. */
    private static final String DEFAULT_PORT_DB = "5432";

    private static String filepath;

    /** File path for directory containing sample data. Can be specified with an environment variable. */
    private static final String DEFAULT_FILE_PATH = "src/main/java/edu/lehigh/cse216/knights/admin/resources/";

    /** The actions prompted to the admin from the App menu. */
    static final String MENU_ACTIONS = "TDS*Vq?";

    /** Options for the four tables in the database: users, ideas, comments, likes. Or for all */
    static final String TABLE_OPTIONS = "UICL*";

    /** Entities in the database which can be invalidated by the admin */
    static final String VALID_ENTITIES = "UI";

    /** Gson object to parse json from sample data files */
    static final Gson gson = new Gson();

    /**
     * Print the menu for our program
     */
    static void menu() {
        System.out.println("Main Menu");
        System.out.println("  [T] Create table(s)");
        System.out.println("  [D] Drop table(s)");
        System.out.println("  [S] Add sample data");
        System.out.println("  [*] Query for data");
        // System.out.println("  [-] Delete a row"); // BACKLOG - not required for phase 2 (replaced by (in)validation)
        System.out.println("  [V] Invalidate an entity");
        System.out.println("  [q] Quit Program");
        System.out.println("  [?] Help (this message)");
    }

    /**
     * Ask the user to enter an option; repeat until we get a valid option
     * 
     * @param in A BufferedReader, for reading from the keyboard
     * @param actions The valid actions for the current screen
     * 
     * @return The character corresponding to the chosen menu option
     */
    static char prompt(BufferedReader in, String actions) {
        // We repeat until a valid single-character option is selected        
        while (true) {
            System.out.print("[" + actions + "] :> ");
            String action;
            try {
                action = in.readLine();
            } catch (IOException e) {
                e.printStackTrace();
                continue;
            }
            if (action.length() != 1)
                continue;
            if (actions.contains(action)) {
                return action.charAt(0);
            }
            System.out.println("Invalid Command");
        }
    }

    /**
     * Ask the user to enter a String message
     * 
     * @param in A BufferedReader, for reading from the keyboard
     * @param message A message to display when asking for input
     * 
     * @return The string that the user provided.  May be "".
     */
    static String getString(BufferedReader in, String message) {
        String s;
        try {
            System.out.print(message + " :> ");
            s = in.readLine();
        } catch (IOException e) {
            e.printStackTrace();
            return "";
        }
        return s;
    }

    /**
     * Ask the user to enter an integer
     * 
     * @param in A BufferedReader, for reading from the keyboard
     * @param message A message to display when asking for input
     * 
     * @return The integer that the user provided.  On error, it will be -1
     */
    static int getInt(BufferedReader in, String message) {
        int i = -1;
        try {
            System.out.print(message + " :> ");
            i = Integer.parseInt(in.readLine());
        } catch (IOException e) {
            e.printStackTrace();
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
        return i;
    }

    /**
     * The main routine runs a loop that gets a request from the user and
     * processes it
     * 
     * @param argv Command-line options.  Ignored by this program.
     */
    public static void main(String[] argv) {
        // Get a fully-configured connection to the database, or exit 
        // immediately
        db = getDatabaseConnection();
        if (db == null)
            return;
        // Set up the file path to use for populating with sample data
        filepath = getFilePath();

        // Start our basic command-line interpreter:
        BufferedReader in = new BufferedReader(new InputStreamReader(System.in));

        /**
         * Add two functions that alter comments, likes to have two new fields
         * also add these fields to create tables bc if tables do not exist then they need to be added
         */
        db.alterIdeaTable();
        db.alterCommentsTable();

        while (true) {
            // Get the user's request, and do it
            //
            // NB: for better testability, each action should be a separate
            //     function call
            char action = prompt(in, MENU_ACTIONS);
            if (action == '?') {
                menu();
            } else if (action == 'q') {
                break;
            } else if (action == 'T') {
                createAllTable(in);
            } else if (action == 'D') {
                dropTable(in);
            }  
            else if (action == '*') {
                getData(in);
            }
            else if (action == 'S') {
                // Add a set of sample data to the database
                addSampleData(in);
            } else if (action == 'V') {
                // update the validation for user or idea
                setValidity(in);
            }
        }
        // Always disconnect from the database when the program exits.
        // Our free ElephantSQL database has a low # of max connections.
        db.disconnect();
    }

    /**
     * Drops one specified table and prints whether the operation succeeded
     * @param tableName the table to drop
     */
    private static void createTableAndPrintResult(String tableName){
        System.out.println(db.createTable(tableName) ? "Created '"+tableName+"' table" : "'"+tableName + "' table already existed");
    }
    
    /**
     * Create all tables in to go in the database. 
     * @param in BufferedReader created by main()
     */
    private static void createAllTable(BufferedReader in) {
        createTableAndPrintResult("users");
        createTableAndPrintResult("ideas");
        createTableAndPrintResult("comments");
        createTableAndPrintResult("likes");
    }

    /**
     * Drops one specified table and prints whether the operation succeeded
     * @param tableName the table to drop
     */
    private static void dropTableAndPrintResult(String tableName){
        System.out.println(db.dropTable(tableName) ? "Dropped '"+ tableName+"' table" : "Failed to drop '" + tableName + "' table");
    }

    /**
     * Prompt the user for a table to drop, then attempt to drop it.
     * @param in BufferedReader created by main()
     */
    private static void dropTable(BufferedReader in) {
        System.out.println("Drop a table and all tables that reference it \n(warning: data cannot be recovered)");
        System.out.println("  [U] 'users'");
        System.out.println("  [I] 'ideas'");
        System.out.println("  [C] 'comments'");
        System.out.println("  [L] 'likes'");
        System.out.println("  [*] Drop all tables");
        char action = prompt(in, App.TABLE_OPTIONS);
        // Must drop tables in specific orders. Cannot drop a table if it's referenced by a foreign key
        if(action == 'U' || action == '*'){
            // As of Phase 2, 'U' and "*" are equivalent
            dropTableAndPrintResult("likes");
            dropTableAndPrintResult("comments");
            dropTableAndPrintResult("ideas");
            dropTableAndPrintResult("users");
        } else if (action == 'I'){
            // tech debt: likes does not actually have a foreign key
            dropTableAndPrintResult("likes");
            dropTableAndPrintResult("comments");
            dropTableAndPrintResult("ideas");
        } else if (action == 'C'){
            dropTableAndPrintResult("comments");
        } else if (action == 'L'){
            dropTableAndPrintResult("likes");
        }
    }

    /**
     * Note: addSampleData() was written in part through code generated using ChatGPT-3.5. 
     * See prompts and responses https://chat.openai.com/share/09994c77-755e-4bbe-9c49-ecc2252eb986
     */
    /**
     * Read sample data from a JSON file and insert data to the database.
     * @param in BufferedReader created by main()
     */
    public static void addSampleData(BufferedReader in){
        // Data files must be in the resources folder, unless path is specified with environment variable
        String jsonString = "";
        try {
            System.out.println("Input file name (with extension) containing sample data:");
            String filename = in.readLine();
            jsonString = new String(Files.readAllBytes(Paths.get(App.filepath + filename)));
        } catch (IOException e) {
            System.out.println("Error reading file: " + e.getMessage());
            return;
        }

        // Read the sample data from the file
        SampleDataContainer container = gson.fromJson(jsonString, SampleDataContainer.class);
        ArrayList<Entity.User> users = container.sampleUsers;
        ArrayList<Entity.Idea> ideas = container.sampleIdeas;
        ArrayList<Entity.Comment> comments = container.sampleComments;
        ArrayList<Entity.Like> likes = container.sampleLikes;
        
        // The order of inserts is important since e.g. 'ideas' has a foriegn key referencing 'users'.
        for(Entity.User user : users){
            db.insertUser(user);
        }
        for(Entity.Idea idea : ideas){
            // ideaID is set automatically in database
            // The sample data should have likeCount = 0 on all ideas, unless admin is doing specific testing
            db.insertIdea(idea);
        }
        for(Entity.Comment comment : comments){
            // commentID is set automatically in database
            db.insertComment(comment);
        }
        for(Entity.Like like : likes){
            // Inserting likes includes incrementing the like count
            db.insertLike(like);
        }
    }

    /**
     * Get some data from the database according to Admin inputs
     * @param in BufferedReader created by main()
     */
    private static void getData(BufferedReader in) {
        System.out.println("Get data from which table?");
        System.out.println("  [U] 'users'");
        System.out.println("  [I] 'ideas'");
        System.out.println("  [C] 'comments'");
        System.out.println("  [L] 'likes'");
        System.out.println("  [*] 'View an idea with details");
        char action = prompt(in, App.TABLE_OPTIONS);
        if(action == 'U'){
            ArrayList<Entity.User> res = db.selectAllUsers();  
            if (res == null){
                System.out.println("Error querying ideas");
                return;
            }
            System.out.println(" User List");
            System.out.println(" ---------");
            // Print each User
            for (Entity.User user : res) {
                String validity = user.valid? "Valid" : "INVALID";
                System.out.println(" ["+user.userId+"] " + validity);
                System.out.println("\t"+user.username+" | email: "+user.email+" | SO: "+user.SO+" | GI: "+user.GI);
                System.out.println("\tnote: "+user.note);
            }
        } else if (action == 'I'){
            ArrayList<Entity.Idea> res = db.selectAllIdeas();
            if (res == null){
                System.out.println("Error querying ideas");
                return;
            }
            System.out.println(" Current Ideas");
            System.out.println(" -------------");
            // Print each Idea
            for (Entity.Idea idea : res) {
                String validity = idea.valid? "Valid" : "INVALID";
                System.out.println(" [" + idea.ideaId + "] " + idea.likeCount + " likes | " + " fileId: " + idea.fileId +", link: " + idea.link + " " + validity);
                System.out.println("\t'"+idea.content+"'");
            }
        } else if (action == 'C'){
            ArrayList<Entity.Comment> res = db.selectAllComments();
            if(res == null){
                System.out.println("Error querying comments");
                return;
            }
            System.out.println(" Current Comments");
            System.out.println(" -------------");
            // Print each comment
            for (Entity.Comment comment : res){
                System.out.println("CommentId: ["+comment.commentId+"]  ideaId:" + comment.ideaId + " | " + " userId: "+ comment.userId + " | fileId: " + comment.fileId + ", link: " + comment.link);
                System.out.println("\t'"+comment.content+"'");
            }
        } else if (action == 'L'){
            ArrayList<Entity.Like> res = db.selectAllLikes();
            if(res == null){
                System.out.println("Error querying likes");
                return;
            }
            System.out.println(" Current Likes");
            System.out.println(" -------------");
            // Print each comment
            for (Entity.Like like : res){
                System.out.println("LikeId: ["+like.ideaId+"]  UserId:" + like.userId + " |");
                System.out.println("\t'"+like.value+"'");
            }
        } else if (action == '*'){
            System.out.print("Please enter the postId: ");
            try{
                String input = in.readLine();
                boolean check = isInteger(input);
                if(check == true){
                    int ideaId = Integer.parseInt(input);
                    ArrayList<Entity.Comment> res = db.selectCommentsDetailedPost(ideaId);
                    if(res == null){
                        return;
                    }
                    System.out.println(" Current Comments for idea: "+ideaId);
                    System.out.println(" -------------");
                    // print each comment
                    for(Entity.Comment comment : res){
                        System.out.println("CommentId: ["+comment.commentId+"]  ideaId:" + comment.ideaId + " | " + " userId: "+ comment.userId + " | fileId: " + comment.fileId + ", link: " + comment.link);
                        System.out.println("\t'"+comment.content+"'");
                    }
                } else {
                    System.out.println("Please input a valid ideaId. Try again.");
                    return;
                }
            } catch (Exception e){
                System.out.println("Error reading input: \n");
                e.printStackTrace();
                return;
            }
        }
    }

    /**
     * Mark a User or Idea as Invalid, or set them back to valid.
     */
    private static void setValidity(BufferedReader in) {
        System.out.println("Set validity of a (U)ser or (I)dea?");
        char action = prompt(in, App.VALID_ENTITIES);
        String SET_INVALID = "Invalidate";
        String SET_VALID = "Restore";
        String entityId = "", validityInput;
        // updatedValidity is specified in the CLI. Only reason to initialize the value here is for avoiding a compiler warning.
        boolean updatedValidity = true;
        int entitiesChanged = 0;
        String entityName = "entity";
        if(action == 'U'){
            entityName = "user";
        } else if(action == 'I') {
            entityName = "idea";
        }

        // Getting inputs
        try {
            System.out.println("Input "+entityName+" ID:");
            entityId = in.readLine();
            System.out.println("Type '"+SET_INVALID+"' to set to invalid or '"+SET_VALID+"' to set to valid.");
            validityInput = in.readLine();
            if(validityInput.equalsIgnoreCase(SET_INVALID)) {
                updatedValidity = false;
            } else if(validityInput.equalsIgnoreCase(SET_VALID)) {
                updatedValidity = true;
            } else {
                System.out.println("Invalid command. Cancelling action without making changes.");
                return;
            }
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }

        if(action == 'U'){
            entitiesChanged = db.setUserValidity(entityId, updatedValidity);
        } else if(action == 'I') {
            try {
              int numericID = Integer.parseInt(entityId);
              entitiesChanged = db.setIdeaValidity(numericID, updatedValidity);
            } catch (NumberFormatException e) {
                System.out.println("Invalid ID, not a number.");
            }
        }
        System.out.println("Updated "+entitiesChanged+" "+entityName+"(s) in database");
    }

    /**
    * Get a fully-configured connection to the database, or exit immediately
    * Uses the Postgres configuration from environment variables.
    * 
    * @return null on failure, otherwise configured database object
    */
    private static Database getDatabaseConnection(){
        System.out.println("db url = " + System.getenv("DATABASE_URL"));
        if( System.getenv("DATABASE_URL") != null ){
            return Database.getDatabase(System.getenv("DATABASE_URL"), DEFAULT_PORT_DB);
        }

        Map<String, String> env = System.getenv();
        String ip = env.get("POSTGRES_IP");
        String port = env.get("POSTGRES_PORT");
        String user = env.get("POSTGRES_USER");
        String pass = env.get("POSTGRES_PASS");
        return Database.getDatabase(ip, port, "", user, pass);
    } 

    /**
    * Get an integer environment variable if it exists, and otherwise return the
    * default value.
    * 
    * @envar      The name of the environment variable to get.
    * @defaultVal The integer value to use as the default if envar isn't found
    * 
    * @returns The best answer we could come up with for a value for envar
    */
    static int getIntFromEnv(String envar, int defaultVal) {
        ProcessBuilder processBuilder = new ProcessBuilder();
        if (processBuilder.environment().get(envar) != null) {
            return Integer.parseInt(processBuilder.environment().get(envar));
        }
        return defaultVal;
    }

    /**
     * Get a file path from an environment variable, or return the default file path.
     * @return the file path to use for locating sample data
     */
    private static String getFilePath() {
        if(System.getenv("FILEPATH") != null ){
            return System.getenv("FILEPATH");
        }
        return DEFAULT_FILE_PATH;
    }

    /**
     * Helper method to check if input is valid integer
     * @param input String from BufferedReader
     * @return boolean if String can be an Integer or not
     */
    public static boolean isInteger (String input){
        try{
            Integer.parseInt(input);
            return true;
        } catch (NumberFormatException e){
            return false;
        }
    }

}