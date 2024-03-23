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
  players: [{
    type: Schema.Types.ObjectId,
    ref: 'User', // Change to 'Player' if using a separate Player model
  }],
});

export default model('League', leagueSchema);
