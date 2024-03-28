import mongoose from 'mongoose';
const { Schema } = mongoose;

const teamSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  leagues: [{
    type: Schema.Types.ObjectId,
    ref: 'League'
  }], // Reference to the leagues the team is part of
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true // Adds createdAt and updatedAt timestamps
});

const Team = mongoose.model('Team', teamSchema);

export default Team;
