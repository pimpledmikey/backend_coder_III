import { UserServices } from "../services/user.services.js";
import { AdoptionServices } from "../services/adoption.services.js";
import { PetServices } from "../services/pet.services.js"; // Ensure PetServices is imported

export class AdoptionsController {
  constructor() {
    this.adoptionsService = new AdoptionServices();
    this.usersService = new UserServices();
    this.petsService = new PetServices(); // Instantiate PetServices
  }

  getAllAdoptions = async (req, res, next) => {
    try {
      const result = await this.adoptionsService.getAll();
      res.send({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  };

  getAdoption = async (req, res, next) => {
    try {
      const adoptionId = req.params.aid;
      const adoption = await this.adoptionsService.getById(adoptionId);
      if (!adoption) return res.status(404).send({ status: "error", error: "Adoption not found" });
      res.send({ status: "success", payload: adoption });
    } catch (error) {
      next(error);
    }
  };

  createAdoption = async (req, res, next) => {
    try {
      const { uid, pid } = req.params;
      const user = await this.usersService.getById(uid); // Use this.usersService
      if (!user) return res.status(404).send({ status: "error", error: "User not found" });
      const pet = await this.petsService.getById(pid); // Use this.petsService
      if (!pet) return res.status(404).send({ status: "error", error: "Pet not found" });
      if (pet.adopted) return res.status(400).send({ status: "error", error: "Pet is already adopted" });
      user.pets.push(pet._id);
      await this.usersService.update(user._id, { pets: user.pets }); // Use this.usersService
      await this.petsService.update(pet._id, { adopted: true, owner: user._id }); // Use this.petsService
      await this.adoptionsService.create({ owner: user._id, pet: pet._id });
      res.send({ status: "success", message: "Pet adopted" });
    } catch (error) {
      next(error);
    }
  };
}