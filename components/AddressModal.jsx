'use client'
import { addAddress } from "@/lib/features/address/addressSlice";
import axios from "axios";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useAuth } from "@clerk/nextjs";

const AddressModal = ({ setShowAddressModal }) => {
    const { getToken } = useAuth();
    const dispatch = useDispatch();

    const [address, setAddress] = useState({
        name: '',
        email: '',
        street: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: ''
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = await getToken();
            const { data } = await axios.post('/api/address', { address }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (data?.newAddress) {
                dispatch(addAddress(data.newAddress)); // <-- now this exists
                toast.success(data.message || 'Address added successfully');
                setShowAddressModal(false);
            } else {
                toast.error('Failed to add address');
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || 'Failed to add address');
        }
    };


    return (
        <form onSubmit={e => toast.promise(handleSubmit(e), { loading: 'Adding Address...' })} className="fixed inset-0 z-50 bg-white/60 backdrop-blur h-screen flex items-center justify-center">
            <div className="flex flex-col gap-5 text-slate-700 w-full max-w-sm mx-6">
                <h2 className="text-3xl ">Add New <span className="font-semibold">Address</span></h2>
                {Object.keys(address).map((key) => (
                    <input
                        key={key}
                        name={key}
                        onChange={handleChange}
                        value={address[key]}
                        className="p-2 px-4 outline-none border border-slate-200 rounded w-full"
                        type={key === 'email' ? 'email' : key === 'zip' ? 'number' : 'text'}
                        placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                        required
                    />
                ))}
                <button className="bg-slate-800 text-white text-sm font-medium py-2.5 rounded-md hover:bg-slate-900 active:scale-95 transition-all">SAVE ADDRESS</button>
            </div>
            <XIcon size={30} className="absolute top-5 right-5 text-slate-500 hover:text-slate-700 cursor-pointer" onClick={() => setShowAddressModal(false)} />
        </form>
    );
};

export default AddressModal;
