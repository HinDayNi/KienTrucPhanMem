const express = require('express');
const router = express.Router();

const File = require('../composite/File');
const Folder = require('../composite/Folder');

let root = new Folder("Root");

router.use(express.json());

function findFolderByName(folder, folderName) {
    if (folder.name === folderName) {
        return folder;
    }

    for (const child of folder.children) {
        if (child instanceof Folder) {
            const found = findFolderByName(child, folderName);
            if (found) {
                return found;
            }
        }
    }

    return null;
}

function collectFolderNames(folder, result = []) {
    result.push(folder.name);

    for (const child of folder.children) {
        if (child instanceof Folder) {
            collectFolderNames(child, result);
        }
    }

    return result;
}

router.post('/add', (req, res) => {
    const { name, type, parent } = req.body;
    const cleanName = (name || '').trim();
    const parentName = (parent || 'Root').trim() || 'Root';

    if (!cleanName) {
        return res.status(400).send('Tên item không được để trống.');
    }

    if (type !== 'file' && type !== 'folder') {
        return res.status(400).send('Loại item không hợp lệ.');
    }

    const parentFolder = findFolderByName(root, parentName);
    if (!parentFolder) {
        return res.status(400).send('Không tìm thấy thư mục cha.');
    }

    if (type === 'file') {
        parentFolder.add(new File(cleanName));
    } else {
        parentFolder.add(new Folder(cleanName));
    }

    return res.send("Added");
});

router.post('/reset', (req, res) => {
    root = new Folder('Root');
    return res.send('Reset');
});

router.get('/folders', (req, res) => {
    return res.json(collectFolderNames(root));
});

router.get('/tree', (req, res) => {
    res.send(root.display());
});

module.exports = router;