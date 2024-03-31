import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const isSeller = async (req, res, next) => {
  //extract token from req.headers
  const authorization = req.headers.authorization;
  const splittedValues = authorization?.split(" ");
  const token = splittedValues?.length == 2 ? splittedValues[1] : undefined;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      "51183235e087ca9aad763b18c5e68c6ca93ae29c435ffe683d05f39c98c81cc4ebe75f9d3aa5d0e873d623da17ae7211b29d969b0700fbb8e8789a5c224fafdc"
    );
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  // find user using userId from payload
  const user = await User.findOne({ _id: payload.userId });
  // if not user throw error
  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  // user role must be seller
  if (user.role !== "seller") {
    return res.status(401).send({ message: "Unauthorized" });
  }
  req.loggedInUserId = user._id;
  next();
  // call next function
};

// no role check
export const isUser = async (req, res, next) => {
  //extract token from req.headers
  const authorization = req.headers.authorization;
  const splittedValues = authorization?.split(" ");
  const token = splittedValues?.length == 2 ? splittedValues[1] : undefined;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      "51183235e087ca9aad763b18c5e68c6ca93ae29c435ffe683d05f39c98c81cc4ebe75f9d3aa5d0e873d623da17ae7211b29d969b0700fbb8e8789a5c224fafdc"
    );
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  // find user using userId from payload
  const user = await User.findOne({ _id: payload.userId });
  // if not user throw error
  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  req.loggedInUserId = user._id;
  next();
  // call next function
};

export const isBuyer = async (req, res, next) => {
  //extract token from req.headers
  const authorization = req.headers.authorization;
  const splittedValues = authorization?.split(" ");
  const token = splittedValues?.length == 2 ? splittedValues[1] : undefined;
  if (!token) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  let payload;
  try {
    payload = jwt.verify(
      token,
      "51183235e087ca9aad763b18c5e68c6ca93ae29c435ffe683d05f39c98c81cc4ebe75f9d3aa5d0e873d623da17ae7211b29d969b0700fbb8e8789a5c224fafdc"
    );
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  // find user using userId from payload
  const user = await User.findOne({ _id: payload.userId });
  // if not user throw error
  if (!user) {
    return res.status(401).send({ message: "Unauthorized" });
  }
  // user role must be seller
  if (user.role !== "buyer") {
    return res.status(401).send({ message: "Unauthorized" });
  }
  req.loggedInUserId = user._id;
  next();
  // call next function
};
