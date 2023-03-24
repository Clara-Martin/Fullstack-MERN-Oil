import ProfileDAO from "../dao/profileDAO.js";

export default class ProfileController {
  static async apiUpdateProfile(req, res) {
    try {
      const clientID = req.body.user_id;
      const clientName = req.body.client_name;
      const address1 = req.body.address_1;
      const address2 = req.body.address_2;
      const city = req.body.city;
      const state = req.body.state;
      const zipcode = req.body.zipcode;

      //validations
      if (clientName.length > 40 || !isNaN(clientName) || clientName == "") {
        res.status(500).json({ error: "Invalid name" });
      } else if (
        address1.length > 100 ||
        address2.length > 100 ||
        address1 == ""
      ) {
        res.status(500).json({ error: "Invalid address" });
      } else if (city.length > 50 || !isNaN(city) || city == "") {
        res.status(500).json({ error: "Invalid city" });
      } else if (state.length != 2 || state == "") {
        res.status(500).json({ error: "Invalid state code" });
      } else if (
        zipcode.length < 5 ||
        zipcode.length > 9 ||
        isNaN(zipcode) ||
        zipcode == ""
      ) {
        res.status(500).json({ error: "Invalid zipcode" });
      } else {
        const ProfileResponse = await ProfileDAO.updateProfile(
          clientID,
          clientName,
          address1,
          address2,
          city,
          state,
          zipcode
        );
        res.json({ status: "success" });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async apiCreateProfile(req, res) {
    try {
      const clientUsername = req.body.client_username;
      const clientPassword = req.body.client_password;

      const CreateProfileResponse = await ProfileDAO.createProfile(
        clientUsername,
        clientPassword
      );
      res.json({
        status: "success",
        user_id: CreateProfileResponse.insertedId.toString(),
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async apiGetProfileData(req, res) {
    try {
      const clientID = req.query.id;
      const GetProfileResponse = await ProfileDAO.getProfile(clientID);
      res.json(GetProfileResponse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  static async apiLoginProfile(req, res) {
    try {
      const clientUsername = req.body.username;
      const clientPassword = req.body.password;

      const loginResponse = await ProfileDAO.loginProfile(
        clientUsername,
        clientPassword
      );

      //checks if the response is null, if it is then we cant find the user
      if (loginResponse == null) {
        res.status(400).send({ message: "User does not exist" });
      }

      if (loginResponse.username !== clientUsername?.toString()) {
        res.status(400).send({ message: "Username Mismatch" });
      }

      //checks if the password are the same
      if (loginResponse.password !== clientPassword?.toString()) {
        res.status(400).send({ message: "Password Mismatch" });
      }
      //return success because the inputted credentials are true
      const theResponse = {
        status: "success",
        user_id: loginResponse._id.toString(),
        // username: loginResponse.username,
        // client_name: loginResponse.client_name,
        // address_1: loginResponse.address_1,
        // address_2: loginResponse.address_2,
        // city: loginResponse.city,
        // state: loginResponse.state,
        // zipcode: loginResponse.zipcode,
      };
      res.json(theResponse);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}