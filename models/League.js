import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const leagueSchema = new Schema({
  leagueName: {
    type: String,
    required: true,
  },
  // Other league properties...
  dayOfWeek: String,
  time: String,
  teamComposition: String,
  skillLevel: String,
  teams: [{ // Changed from 'players' to 'teams'
    type: Schema.Types.ObjectId,
    ref: 'Team', // Assuming you have a Team model
  }],
});

export default model('League', leagueSchema);
