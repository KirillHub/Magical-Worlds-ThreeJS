import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../reducer";
import { Location } from "./types";

const initialState: Location = {
	location: 'default'
};

export const locationSlice = createSlice({
	name: 'location',
	initialState,
	reducers: {
		setNewLocation: (state, action) => {
			state.location = action.payload
		},
	},
});

export const { setNewLocation } = locationSlice.actions;

export const getLocation = (state: RootState) => state.location.location;

export const locationReducer = locationSlice.reducer;

