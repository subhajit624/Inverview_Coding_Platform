import { SolvedProblems } from "../models/SolvedProblems.js";


// ✅ SAVE SOLVED PROBLEM
export const markProblemSolved = async (req, res) => {
  try {
    const userId = req.user._id;
    const { problemId } = req.body;

    let userDoc = await SolvedProblems.findOne({ userId });

    if (!userDoc) {
      userDoc = await SolvedProblems.create({
        userId,
        problems: [{ problemId }]
      });
    } else {
      const alreadySolved = userDoc.problems.some(
        p => p.problemId === problemId
      );

      if (!alreadySolved) {
        userDoc.problems.push({ problemId });
        await userDoc.save();
      }
    }

    res.status(200).json({
      success: true,
      message: "Problem saved"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ GET MY SOLVED PROBLEMS
export const getSolvedProblems = async (req, res) => {
  try {
    const userId = req.user._id;

    const data = await SolvedProblems.findOne({ userId });

    res.json({
      solved: data ? data.problems : []
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// ✅ LEADERBOARD (WITH USER NAME 🔥)
export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await SolvedProblems.find()
      .populate("userId", "name email") 
      .sort({ "problems.length": -1 });

    const formatted = leaderboard.map((item, index) => ({
      rank: index + 1,
      userId: item.userId._id,
      name: item.userId.name,
      email: item.userId.email,
      solvedCount: item.problems.length
    }));

    res.json(formatted);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};