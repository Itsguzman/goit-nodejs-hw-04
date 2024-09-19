import express from "express";
import { contactValidation } from "../../validation.js";
import {
  addContact,
  getAllContacts,
  getContactById,
  removeContact,
  updateContact,
} from "../../contactControllers/contactsController.js";

const router = express.Router();

router.get("/", getAllContacts);

router.get("/:contactId", getContactById);

router.post("/", addContact);

router.delete("/:contactId", removeContact);

router.put("/:contactId", updateContact);

export default router;
