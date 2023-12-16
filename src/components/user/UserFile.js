import React, { useState, useEffect } from 'react';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../../config/firebase';
import { Table, Button, Modal, Header, Icon, Input,Grid } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

function FileApp() {
    const [fileUpload, setFileUpload] = useState(null);
    const [fileUrls, setFileUrls] = useState([]);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState(null);

    const userId = localStorage.getItem('uid');

    useEffect(() => {
        const fetchFiles = async () => {
            const filesListRef = ref(storage, `files/${userId}/`);
            try {
                const response = await listAll(filesListRef);
                const filesData = await Promise.all(
                    response.items.map(itemRef =>
                        getDownloadURL(itemRef).then(url => ({
                            name: itemRef.name,
                            url
                        }))
                    )
                );
                setFileUrls(filesData);
            } catch (error) {
                console.error("Error fetching files:", error);
            }
        };

        fetchFiles();
    }, [userId]);

    const handleFileChange = (event) => {
        setFileUpload(event.target.files[0]);
    };

    const uploadFile = async () => {
        if (!fileUpload) return;
        const fileRef = ref(storage, `files/${userId}/${fileUpload.name}`);
        try {
            const uploadResult = await uploadBytes(fileRef, fileUpload);
            const url = await getDownloadURL(uploadResult.ref);
            setFileUrls(prev => [...prev, { name: fileRef.name, url }]);
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    const confirmDelete = (file) => {
        setFileToDelete(file);
        setConfirmOpen(true);
    };

    const deleteFile = async () => {
        const fileRef = ref(storage, `files/${userId}/${fileToDelete.name}`);
        try {
            await deleteObject(fileRef);
            setFileUrls(prev => prev.filter(f => f.name !== fileToDelete.name));
        } catch (error) {
            console.error("Error deleting file:", error);
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <div className="FileApp">
            <Grid>
                <Grid.Column>
                    <Input type="file" onChange={handleFileChange} />
                    <Button onClick={uploadFile} primary disabled={!fileUpload}>Upload</Button>
                </Grid.Column>
            </Grid>

            <Table celled>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Filename</Table.HeaderCell>
                        <Table.HeaderCell>Actions</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {fileUrls.map((file, index) => (
                        <Table.Row key={index}>
                            <Table.Cell>{file.name}</Table.Cell>
                            <Table.Cell>
                                <Button as="a" href={file.url} target="_blank" download>Download</Button>
                                <Button color="red" onClick={() => confirmDelete(file)}>Delete</Button>
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>

            <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                <Header icon='trash' content='Confirm File Deletion' />
                <Modal.Content>
                    <p>Are you sure you want to delete this file?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='red' onClick={() => setConfirmOpen(false)}>No</Button>
                    <Button color='green' onClick={deleteFile}>Yes</Button>
                </Modal.Actions>
            </Modal>
        </div>
    );
}

export default FileApp;
