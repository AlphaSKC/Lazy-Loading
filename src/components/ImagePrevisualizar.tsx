import React, { useState, useRef, ChangeEvent } from 'react';
import { Box, Button} from '@mui/material';

export default function ImagePrevisualizar() {
    const [image, setImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const file = e.target.files ? e.target.files[0] : null;
        if (file && file.type.startsWith("image")) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImage(null);
        }
    };

    return (
        <Box>
            <input
                type="file"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
            />
            <Button variant="contained" onClick={() => fileInputRef.current?.click()}>
                Upload Image
            </Button>
            {image && (
                <>
                    <img src={image} alt="Preview" style={{ marginTop: '20px', maxWidth: '100%' }} />
                </>
            )}
        </Box>

    );
}
