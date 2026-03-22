function setStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
}

function setOutput(elementId, content) {
    document.getElementById(elementId).innerText = content;
}

function setText(elementId, content) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = content;
    }
}

function setButtonLoading(buttonId, isLoading, loadingLabel, defaultLabel) {
    const button = document.getElementById(buttonId);
    button.disabled = isLoading;
    button.textContent = isLoading ? loadingLabel : defaultLabel;
}

async function fetchText(url, options) {
    const response = await fetch(url, options);
    const body = await response.text();

    if (!response.ok) {
        throw new Error(extractReadableError(body, response.status));
    }

    return body;
}

function extractReadableError(rawText, statusCode) {
    const raw = String(rawText || '').trim();
    if (!raw) {
        return `Request failed: ${statusCode}`;
    }

    const preMatch = raw.match(/<pre>([\s\S]*?)<\/pre>/i);
    if (preMatch && preMatch[1]) {
        return preMatch[1].replace(/\s+/g, ' ').trim();
    }

    // Remove HTML tags if server returned an error page.
    const noTags = raw.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return noTags || `Request failed: ${statusCode}`;
}

async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const raw = await response.text();

    let body = null;
    if (raw) {
        try {
            body = JSON.parse(raw);
        } catch (parseError) {
            if (!response.ok) {
                throw new Error(extractReadableError(raw, response.status));
            }

            throw new Error(`Response is not valid JSON: ${extractReadableError(raw, response.status).slice(0, 120)}`);
        }
    }

    if (!response.ok) {
        const message = body && body.message
            ? body.message
            : extractReadableError(raw, response.status);
        throw new Error(message);
    }

    return body || {};
}

// ===== COMPOSITE =====
async function loadFolders() {
    try {
        const folders = await fetchJson('/composite/folders');
        if (Array.isArray(folders) && folders.length > 0) {
            return folders;
        }

        return ['Root'];
    } catch (error) {
        return ['Root'];
    }
}

async function addItem() {
    const nameInput = document.getElementById("itemName");
    const typeInput = document.getElementById("itemType");
    const parentInput = document.getElementById("parentFolder");
    const name = nameInput.value.trim();
    const type = typeInput.value;
    const parent = parentInput ? parentInput.value : 'Root';

    if (!name) {
        setStatus("compositeStatus", "Vui lòng nhập tên item.", "error");
        nameInput.focus();
        return;
    }

    try {
        setButtonLoading("btnAddItem", true, "Đang thêm...", "Thêm vào cây");
        setStatus("compositeStatus", "Đang gửi yêu cầu thêm item...", "info");

        await fetchText('/composite/add', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, type, parent })
        });

        nameInput.value = '';
        await loadTree(true);
        await refreshFolderSelect();
        setStatus("compositeStatus", `Đã thêm ${type}: ${name}`, "success");
    } catch (error) {
        setStatus("compositeStatus", `Lỗi: ${error.message}`, "error");
    } finally {
        setButtonLoading("btnAddItem", false, "Đang thêm...", "Thêm vào cây");
    }
}

async function loadTree(silent) {
    try {
        setButtonLoading("btnLoadTree", true, "Đang tải...", "Tải lại cây");
        if (!silent) {
            setStatus("compositeStatus", "Đang tải cấu trúc cây...", "info");
        }

        const data = await fetchText('/composite/tree');
        setOutput("tree", data || '(Cây rỗng)');

        if (!silent) {
            setStatus("compositeStatus", "Tải cấu trúc cây thành công.", "success");
        }
    } catch (error) {
        setStatus("compositeStatus", `Lỗi: ${error.message}`, "error");
    } finally {
        setButtonLoading("btnLoadTree", false, "Đang tải...", "Tải lại cây");
    }
}

async function refreshFolderSelect() {
    const parentInput = document.getElementById('parentFolder');
    if (!parentInput) {
        return;
    }

    const folders = await loadFolders();
    const selected = parentInput.value;
    parentInput.innerHTML = folders
        .map(folderName => `<option value="${folderName}">${folderName}</option>`)
        .join('');

    if (folders.includes(selected)) {
        parentInput.value = selected;
    }
}

async function resetTree() {
    try {
        await fetchText('/composite/reset', { method: 'POST' });
        await loadTree(true);
        await refreshFolderSelect();
        setStatus('compositeStatus', 'Đã reset cây về Root.', 'success');
    } catch (error) {
        setStatus('compositeStatus', `Lỗi: ${error.message}`, 'error');
    }
}

async function runCompositeDemo() {
    const demoItems = [
        { name: 'ProjectA', type: 'folder', parent: 'Root' },
        { name: 'docs', type: 'folder', parent: 'ProjectA' },
        { name: 'spec.pdf', type: 'file', parent: 'docs' },
        { name: 'src', type: 'folder', parent: 'ProjectA' },
        { name: 'main.js', type: 'file', parent: 'src' }
    ];

    try {
        setStatus('compositeStatus', 'Đang tạo dữ liệu mẫu cho cây thư mục...', 'info');
        await fetchText('/composite/reset', { method: 'POST' });

        for (const item of demoItems) {
            await fetchText('/composite/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item)
            });
        }

        await loadTree(true);
        await refreshFolderSelect();
        setStatus('compositeStatus', 'Đã tạo xong kịch bản mẫu Composite.', 'success');
    } catch (error) {
        setStatus('compositeStatus', `Lỗi: ${error.message}`, 'error');
    }
}

// ===== OBSERVER =====
async function refreshObserverSubscribers() {
    try {
        const [stockUsers, taskUsers] = await Promise.all([
            fetchJson('/observer/stock/subscribers'),
            fetchJson('/observer/task/subscribers')
        ]);

        setText('stockSubscribers', `Investor đang theo dõi: ${stockUsers.join(', ') || '(trống)'}`);
        setText('taskSubscribers', `Team member đang theo dõi: ${taskUsers.join(', ') || '(trống)'}`);
    } catch (_) {
        setText('stockSubscribers', 'Không tải được danh sách investor.');
        setText('taskSubscribers', 'Không tải được danh sách team member.');
    }
}

async function addStockSubscriber() {
    const input = document.getElementById('investorName');
    const name = input.value.trim();

    if (!name) {
        setStatus('observerStockStatus', 'Vui lòng nhập tên investor.', 'error');
        input.focus();
        return;
    }

    try {
        await fetchJson('/observer/stock/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        input.value = '';
        await refreshObserverSubscribers();
        setStatus('observerStockStatus', `Đã thêm investor: ${name}`, 'success');
    } catch (error) {
        const message = String(error.message || 'Có lỗi xảy ra.');
        if (message.includes('Cannot POST /observer/stock/subscribe')) {
            setStatus('observerStockStatus', 'Server đang chạy bản cũ, chưa có API thêm investor. Hãy restart app Tuan03_1.', 'error');
            return;
        }

        setStatus('observerStockStatus', `Lỗi: ${message}`, 'error');
    }
}

async function addTaskSubscriber() {
    const input = document.getElementById('memberName');
    const name = input.value.trim();

    if (!name) {
        setStatus('observerTaskStatus', 'Vui lòng nhập tên thành viên.', 'error');
        input.focus();
        return;
    }

    try {
        await fetchJson('/observer/task/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        input.value = '';
        await refreshObserverSubscribers();
        setStatus('observerTaskStatus', `Đã thêm thành viên: ${name}`, 'success');
    } catch (error) {
        const message = String(error.message || 'Có lỗi xảy ra.');
        if (message.includes('Cannot POST /observer/task/subscribe')) {
            setStatus('observerTaskStatus', 'Server đang chạy bản cũ, chưa có API thêm thành viên. Hãy restart app Tuan03_1.', 'error');
            return;
        }

        setStatus('observerTaskStatus', `Lỗi: ${message}`, 'error');
    }
}

async function updatePrice() {
    const priceInput = document.getElementById("price");
    const priceValue = Number(priceInput.value);

    if (!Number.isFinite(priceValue) || priceValue < 0) {
        setStatus("observerStockStatus", "Giá phải là số >= 0.", "error");
        priceInput.focus();
        return;
    }

    try {
        setButtonLoading("btnUpdatePrice", true, "Đang cập nhật...", "Cập nhật giá");
        setStatus("observerStockStatus", "Đang phát sự kiện thay đổi giá...", "info");

        const payload = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: priceValue })
        };

        let data;
        try {
            data = await fetchText('/observer/stock/update', payload);
        } catch (stockRouteError) {
            // Support projects that only expose legacy endpoint /observer/update.
            if (!String(stockRouteError.message || '').includes('Cannot POST /observer/stock/update')) {
                throw stockRouteError;
            }

            data = await fetchText('/observer/update', payload);
        }

        setOutput("observerStock", data || '(Không có subscriber)');
        setStatus("observerStockStatus", "Đã gửi thông báo cho các investor.", "success");
    } catch (error) {
        setStatus("observerStockStatus", `Lỗi: ${error.message}`, "error");
    } finally {
        setButtonLoading("btnUpdatePrice", false, "Đang cập nhật...", "Cập nhật giá");
    }
}

async function updateTaskStatus() {
    const statusInput = document.getElementById('taskStatus');
    const statusValue = statusInput.value;

    try {
        setButtonLoading("btnUpdateTaskStatus", true, "Đang cập nhật...", "Cập nhật task");
        setStatus("observerTaskStatus", "Đang phát sự kiện thay đổi task...", "info");

        const data = await fetchText('/observer/task/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: statusValue })
        });

        setOutput("observerTask", data || '(Không có subscriber)');
        setStatus("observerTaskStatus", "Đã gửi thông báo cho các thành viên.", "success");
    } catch (error) {
        setStatus("observerTaskStatus", `Lỗi: ${error.message}`, "error");
    } finally {
        setButtonLoading("btnUpdateTaskStatus", false, "Đang cập nhật...", "Cập nhật task");
    }
}

// ===== ADAPTER =====
async function convertXML() {
    const xmlInput = document.getElementById("xmlInput");
    const xml = xmlInput.value.trim();

    if (!xml || !xml.startsWith('<')) {
        setStatus("adapterStatus", "XML không hợp lệ. Vui lòng kiểm tra đầu vào.", "error");
        xmlInput.focus();
        return;
    }

    try {
        setButtonLoading("btnConvertXML", true, "Đang chuyển đổi...", "Chuyển XML");
        setStatus("adapterStatus", "Đang parse XML và map sang JSON...", "info");

        const data = await fetchJson('/adapter/convert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ xml })
        });

        setOutput("jsonResult", JSON.stringify(data, null, 2));
        setStatus("adapterStatus", "Chuyển đổi XML -> JSON thành công.", "success");
    } catch (error) {
        setStatus("adapterStatus", `Lỗi: ${error.message}`, "error");
    } finally {
        setButtonLoading("btnConvertXML", false, "Đang chuyển đổi...", "Chuyển XML");
    }
}

async function convertJSONToXML() {
    const jsonInput = document.getElementById('jsonInput');
    const json = jsonInput.value.trim();

    if (!json || !json.startsWith('{')) {
        setStatus('adapterReverseStatus', 'JSON không hợp lệ. Vui lòng kiểm tra đầu vào.', 'error');
        jsonInput.focus();
        return;
    }

    try {
        setButtonLoading('btnConvertJSON', true, 'Đang chuyển đổi...', 'Convert JSON');
        setStatus('adapterReverseStatus', 'Đang map JSON sang XML...', 'info');

        const data = await fetchJson('/adapter/convert/json-to-xml', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ json })
        });

        setOutput('xmlResult', data.xml || '(Không có dữ liệu XML)');
        setStatus('adapterReverseStatus', 'Chuyển đổi JSON -> XML thành công.', 'success');
    } catch (error) {
        setStatus('adapterReverseStatus', `Lỗi: ${error.message}`, 'error');
    } finally {
        setButtonLoading('btnConvertJSON', false, 'Đang chuyển đổi...', 'Convert JSON');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setOutput("tree", "Root\n  (thêm file hoặc folder để xem cây thực tế)");
    setOutput("observerStock", "Chờ cập nhật giá cổ phiếu để phát thông báo cho Investor A và B.");
    setOutput("observerTask", "Chờ cập nhật trạng thái task để thông báo cho Team member An và Binh.");
    setOutput("jsonResult", "Nhập XML từ hệ thống nguồn và bấm 'Convert XML' để xem dữ liệu JSON đích.");
    setOutput("xmlResult", "Nhập JSON rồi bấm 'Convert JSON' để xem dữ liệu XML nguồn.");

    setStatus("compositeStatus", "Sẵn sàng thao tác Composite.", "info");
    setStatus("observerStockStatus", "Sẵn sàng thao tác Observer cho cổ phiếu.", "info");
    setStatus("observerTaskStatus", "Sẵn sàng thao tác Observer cho task.", "info");
    setStatus("adapterStatus", "Sẵn sàng thao tác Adapter.", "info");
    setStatus("adapterReverseStatus", "Sẵn sàng chuyển đổi JSON -> XML.", "info");

    loadTree(true);
    refreshFolderSelect();
    refreshObserverSubscribers();
});
