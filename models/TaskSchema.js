import mongoose from "mongoose";

const schema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
});

const taskModel = mongoose.model("task", schema);
export default taskModel;
