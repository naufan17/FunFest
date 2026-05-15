import React, { useState } from 'react';
import Modal from '@/Components/Modal';
import Button from '@/Components/Button';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function ResultInputModal({ show, onClose, onConfirm, processing }) {
    const [time, setTime] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(time);
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <form onSubmit={handleSubmit} className="p-8">
                <h2 className="text-2xl font-black italic tracking-tight text-[#0A1D37] uppercase mb-4">
                    Input Result
                </h2>
                
                <p className="text-sm text-gray-500 mb-8">
                    Enter the official finish time for the runner. Format: <span className="font-mono font-bold text-[#FF5722]">HH:MM:SS</span> (e.g., 01:23:45)
                </p>

                <div>
                    <InputLabel htmlFor="finish_time" value="Finish Time" />
                    <TextInput
                        id="finish_time"
                        type="text"
                        name="finish_time"
                        value={time}
                        className="mt-1 block w-full"
                        placeholder="00:00:00"
                        onChange={(e) => setTime(e.target.value)}
                        required
                        autoFocus
                    />
                </div>

                <div className="mt-10 flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={processing}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        processing={processing}
                    >
                        Save Result
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
