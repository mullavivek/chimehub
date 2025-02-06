import Mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number
}

const connection: ConnectionObject = {}

async function DataBaseConnection()  {
  if (connection.isConnected) {
    console.log("Database Connected");
    return
  }
  try{
    const db = await Mongoose.connect(process.env.MONGODB_URI || '', {} );

    connection.isConnected = db.connections[0].readyState;
    console.log("Database Connected");
  } catch (error) {
    console.log("Database connection failed", error);
    process.exit(1);
  }
}

export default DataBaseConnection;
