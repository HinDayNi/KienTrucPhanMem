function setStatus(elementId, message, type) {
    const statusEl = document.getElementById(elementId);
    statusEl.className = `status ${type}`;
    statusEl.textContent = message;
}

function setOutput(elementId, content) {
    document.getElementById(elementId).innerText = content;
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
        throw new Error(body || `Request failed: ${response.status}`);
    }

    return body;
}

async function fetchJson(url, options) {
    const response = await fetch(url, options);
    const body = await response.json();

    if (!response.ok) {
        throw new Error(body.message || `Request failed: ${response.status}`);
    }

    return body;
}

// ===== COMPOSITE =====
async function addItem() {
    const nameInput = document.getElementById("itemName");
    const typeInput = document.getElementById("itemType");
    const name = nameInput.value.trim();
    const type = typeInput.value;

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
            body: JSON.stringify({ name, type })
        });

        nameInput.value = '';
        await loadTree(true);
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

// ===== OBSERVER =====
async function updatePrice() {
    const priceInput = document.getElementById("price");
    const priceValue = Number(priceInput.value);

    if (!Number.isFinite(priceValue) || priceValue < 0) {
        setStatus("observerStatus", "Giá phải là số >= 0.", "error");
        priceInput.focus();
        return;
    }

    try {
        setButtonLoading("btnUpdatePrice", true, "Đang cập nhật...", "Cập nhật giá");
        setStatus("observerStatus", "Đang phát sự kiện thay đổi giá...", "info");

        const data = await fetchText('/observer/update', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ price: priceValue })
        });

        setOutput("observer", data || '(Không có subscriber)');
        setStatus("observerStatus", "Đã gửi thông báo cho các observer.", "success");
    } catch (error) {
        setStatus("observerStatus", `Lỗi: ${error.message}`, "error");
    } finally {
        setButtonLoading("btnUpdatePrice", false, "Đang cập nhật...", "Cập nhật giá");
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

document.addEventListener('DOMContentLoaded', function () {
    setOutput("tree", "Chưa có dữ liệu.");
    setOutput("observer", "Nhập giá và bấm 'Cập nhật giá' để xem thông báo.");
    setOutput("jsonResult", "Nhập XML và bấm 'Chuyển XML' để xem JSON.");

    setStatus("compositeStatus", "Sẵn sàng thao tác Composite.", "info");
    setStatus("observerStatus", "Sẵn sàng thao tác Observer.", "info");
    setStatus("adapterStatus", "Sẵn sàng thao tác Adapter.", "info");

    loadTree(true);
});
