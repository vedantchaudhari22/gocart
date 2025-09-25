import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchAddress = createAsyncThunk(
    "address/fetchAddress",
    async ({ token }, thunkAPI) => {
        try {
            const response = await axios.get("/api/address", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data?.addresses || [];
        } catch (error) {
            return thunkAPI.rejectWithValue(error?.response?.data);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState: {
        list: [],
    },
    reducers: {
        addAddress: (state, action) => {
            state.list.push(action.payload); // mutate draft only
            // do NOT return anything here
        },
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAddress.fulfilled, (state, action) => {
            state.list = action.payload; // fine
        })
    }
});


export const { addAddress } = addressSlice.actions;
export default addressSlice.reducer;
