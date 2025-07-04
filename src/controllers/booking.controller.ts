import { NextFunction, Response } from "express";
import Booking from "../models/booking.model";
import HttpStatusCodes from "@src/common/HttpStatusCodes";
import { validateCreateBooking } from "@src/validations/booking.validation";
import { generateActivityEmail, sendEmail } from "@src/util/sendEmail.util";

const createBooking = async (req: any, res: Response) => {
  try {
    const data = await validateCreateBooking.validateAsync(req.body);
    const existingbookings = await Booking.find();
    const filterbookings = existingbookings.filter(
      (_booking) =>
        _booking.orderdedBy === req.body.orderdedBy &&
        _booking.riderId === req.body.riderId
    );

    if (filterbookings?.length > 0) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        error: "You have already booked this ride.",
      });
    } else {
      const booking = new Booking(data);
      await booking.save();
      const text = await generateActivityEmail(data.fullName);
      // await sendEmail(data?.email, "Booking Received", text);
      return res.json(booking);
    }
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const updateBooking = async (req: any, res: Response) => {
  try {
    const id = req.params.id;
    const data = await validateCreateBooking.validateAsync(req.body);

    const booking = await Booking.findByIdAndUpdate(
      id,
      { $set: { ...data } },
      { new: true }
    );
    await booking?.save();
    if (booking === null)
      return res.status(400).json({ error: "Booking details not updated" });
    await booking.save();
    res.json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const deleteBookingById = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    await booking.deleteOne();

    res.status(HttpStatusCodes.NO_CONTENT).json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const getAllBookings = async (req: any, res: Response) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ error: error.message });
  }
};

const getBookingById = async (req: any, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(400).json({ error: "Booking not found" });
    res.json(booking);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

export {
  createBooking,
  updateBooking,
  deleteBookingById,
  getAllBookings,
  getBookingById,
};
