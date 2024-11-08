import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { alertStore } from '../../../../../core/alerts/alertStore';
import ImageService from '../../../../../core/images/ImageService';
import { removeMainImage, resetImagesForm } from '../../../../../core/images/imageStore';
import PostService from '../../../../../core/posts/PostService';
import { addPost, openCloseAddPhotosForm } from '../../../../../core/posts/postsStore';
import styles from './ImageUpload.module.css';
interface PostsState {
    posts: any[];
    isLoaded: boolean;
}

const ImageUpload = () => {
    const dispatch = useDispatch();
    const [mainImage, setMainImage] = useState<File | null>(null);
    const imageService = new ImageService('https://example.com/api/images');
    const postService = new PostService();
    const imagesState = useSelector((state: any) => state.images);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setMainImage(null);
            console.warn("No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const fileString = reader.result as string;
            dispatch(addPost({
                images: [fileString],
                id: 0,
                title: '',
                message: '',
                creationDate: new Date(),
                userId: 0,
                location: '',
                loves: 0,
                comments: [],
                isArchived: false,
                tags: [],
                isPublished: false,
                publishDate: '',
                alt_image: '',
                source_image: '',
                alt_avatar: '',
                source_avatar: '',
                username: '',
                role: '',
                url_avatar: ''
            }));
        };

        try {
            reader.readAsDataURL(file);
            setMainImage(file);
            dispatch(resetImagesForm());
        } catch (error) {
            console.error("Error reading file:", error);
            alertStore.actions.createAlert("error", "An error occurred while reading the file.");
        }
    };

    function handleRemoveImage() {
        if (!mainImage) {
            console.warn("No main image to remove.");
            return;
        }

        dispatch(removeMainImage());
        setMainImage(null);
    }

    async function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!mainImage) {
            console.error("No image selected for upload.");
            alertStore.actions.createAlert("error", "No image selected for upload.");
            return;
        }

        const formData = new FormData();
        formData.append('image', mainImage);

        try {
            const uploadResult = await imageService.uploadImages(formData);
            if (uploadResult?.success) {
                console.log('Image uploaded successfully:', uploadResult.url);
                alertStore.actions.createAlert("success", "Image uploaded successfully.");
            } else {
                console.error('Image upload failed:', uploadResult?.error || 'Unknown error');
                alertStore.actions.createAlert("error", `Image upload failed: ${uploadResult?.error || 'Unknown error'}`);
            }
        } catch (uploadError) {
            console.error("Error during image upload:", uploadError);
            alertStore.actions.createAlert("error", "An error occurred during image upload.");
        }
    }

    return (
        <div className={styles.formBackground}>
            <form className={styles.form}>
                <button type="button" className={styles.closeButton} onClick={() => { dispatch(openCloseAddPhotosForm(false)); handleRemoveImage(); }}>
                    Close
                </button>
                <h2 className={styles.formTitle}>Add Post Image</h2>
                <h3 className={styles.titles}>Main Image</h3>
                <label className={styles.mainImageInputLabel} title={mainImage?.name || "No image selected"}>
                    <div className={styles.mainImageBackground}>
                        <div
                            className={styles.mainImage}
                            style={{ backgroundImage: `url(${imagesState.mainImageUrl})` }}
                        />
                    </div>
                    <input
                        type="file"
                        className={styles.mainImageInput}
                        onChange={handleFileUpload}
                        accept="image/*"
                    />
                </label>
                {mainImage && (
                    <button type="button" className={styles.mainImageRemoveButton} onClick={handleRemoveImage}>
                        REMOVE
                    </button>
                )}
                <button type="button" className={styles.sendButton} onClick={handleSubmit}>
                    SEND
                </button>
            </form>
        </div>
    );
};

export default ImageUpload;


