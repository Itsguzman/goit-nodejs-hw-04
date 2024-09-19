import { Contact } from "../models/contactSchema.js";

const getAllContacts = async (req, res, next) => {
  try {
    const result = await Contact.find();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getContactById = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const selectContact = Contact.findOne(contactId);

    if (!selectContact) {
      res.status(400).json({ message: "Contact not found" });
    }
    return selectContact;
  } catch (error) {
    next(error);
  }
};

const addContact = async (req, res, next) => {
  // const { name, email, phone } = req.body;/req.body
  const { error } = contactValidation.validate(req.body);

  if (error) {
    res.status(400).json({ message: "Please fill all required fields" });
  }

  try {
    const result = await Contact.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const removeContact = async (req, res, next) => {
  const { contactId } = req.params;
  try {
    const result = await Contact.findByIdAndDelete(contactId);

    if (!result) {
      res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    next(error);
  }
};

const updateContact = async (req, res, next) => {
  try {
    const result = await Contact.findByIdAndUpdate(
      req.params.contactId,
      req.body
    );
    if (!result) {
      res.status(404).json({ message: "Contact not found" });
    }
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

export {
  getAllContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
