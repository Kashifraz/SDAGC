const asyncHandler = require("express-async-handler");
const User = require("../models/userModel.js");

const registerUser = asyncHandler(async (req, res) => {
  console.log("registerUser arrived on server");
  const { firstName, lastName, email, password } = req.body;

  // check if email exists in db
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    res.json({ message: "User already exists" });
    throw new Error("User already exists");
  }

  // create new user document in db
  const user = await User.create({ firstName, lastName, email, password, role: "citizen" });

  if (user) {
    res.status(201).json({
      _id: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: "dummy_token" // generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  console.log("loginUser arrived on server");
  const { email, password } = req.body;

  console.log(req.body);

  // check if user email exists in db
  const user = await User.findOne({ email })

  // return user obj if their password matches
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: "dummy_token" // generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

const getUserProfile = asyncHandler(async (req, res) => {
  console.log("getUserProfile arrived on server");
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.json({
      _id: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      token: "dummy_token" // generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
})

const updateUserCoordinate = asyncHandler(async (req, res) => {
  console.log("updateUserProfile arrived on server");

  const { email, coordinate } = req.body;

  // find user by email
  const user = await User.findOne({ email });

  if (user) {

    // update user coordinate - generated using Github Copilot
    user.coordinate = coordinate;

    await user.save();

    res.status(200).json({
      _id: user._id,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        coordinate: user.coordinate
      },
      token: "dummy_token" // generateToken(user._id),
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }

})

const getAllUsers = asyncHandler(async (req, res) => {
  console.log("getAllUsers arrived on server");
  const users = await User.find({});
  res.json(users);
});

const getPoliceOfficers = asyncHandler(async (req, res) => {
  console.log("getPoliceOfficers arrived on server");
  const users = await User.find({ role: "police" });
  res.json(users);
});

const getCitizens = asyncHandler(async (req, res) => {
  console.log("getCitizens arrived on server");
  const users = await User.find({ role: "citizen" });
  res.json(users);
});

// export functions to be used in routes
module.exports = { registerUser, loginUser, getUserProfile, updateUserCoordinate, getAllUsers, getPoliceOfficers, getCitizens };
