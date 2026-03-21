async function request(url, options) {
  const response = await fetch(url, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(body.message || 'Yêu cầu thất bại.');
  }
  return body;
}

function showStatus(message, isError) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.style.background = isError ? '#fdecec' : '#ecf7f1';
  status.style.color = isError ? '#8d2323' : '#24573b';
}

function render(id, data) {
  document.getElementById(id).textContent = JSON.stringify(data, null, 2);
}

async function loadBooks() {
  const books = await request('/api/library/books');
  render('booksList', books);
}

async function loadLoans() {
  const loans = await request('/api/library/loans');
  render('loansList', loans);
}

async function loadNotifications() {
  const observers = await request('/api/library/observers');
  const notifications = await request('/api/library/notifications');
  render('notifications', { observers, notifications });
}

async function addBook() {
  try {
    const payload = {
      title: document.getElementById('bookTitle').value,
      author: document.getElementById('bookAuthor').value,
      genre: document.getElementById('bookGenre').value,
      type: document.getElementById('bookType').value
    };

    const book = await request('/api/library/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    showStatus(`Đã thêm sách: ${book.title}`);
    await loadBooks();
    await loadNotifications();
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function searchBooks() {
  try {
    const by = document.getElementById('searchBy').value;
    const q = document.getElementById('searchKeyword').value;
    const result = await request(`/api/library/search?by=${encodeURIComponent(by)}&q=${encodeURIComponent(q)}`);
    render('searchResult', result);
    showStatus(`Đã tìm kiếm theo ${by}.`);
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function borrowBook() {
  try {
    const payload = {
      bookId: document.getElementById('borrowBookId').value,
      borrowerName: document.getElementById('borrowerName').value,
      extendDays: document.getElementById('extendDays').value,
      specialEdition: document.getElementById('specialEdition').value
    };

    const loan = await request('/api/library/borrow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    showStatus(`Mượn sách thành công. Mã phiếu: ${loan.id}`);
    await loadBooks();
    await loadLoans();
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function returnBook() {
  try {
    const payload = {
      loanId: document.getElementById('returnLoanId').value
    };

    const loan = await request('/api/library/return', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    showStatus(`Trả sách thành công cho phiếu ${loan.id}.`);
    await loadBooks();
    await loadLoans();
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function addObserver() {
  try {
    const payload = {
      name: document.getElementById('observerName').value,
      role: document.getElementById('observerRole').value
    };

    await request('/api/library/observers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    showStatus('Đăng ký observer thành công.');
    await loadNotifications();
  } catch (error) {
    showStatus(error.message, true);
  }
}

async function checkOverdue() {
  try {
    const result = await request('/api/library/overdue/check', {
      method: 'POST'
    });

    showStatus(`Đã quét quá hạn. Số thông báo mới: ${result.events.length}`);
    await loadLoans();
    await loadNotifications();
  } catch (error) {
    showStatus(error.message, true);
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  try {
    await loadBooks();
    await loadLoans();
    await loadNotifications();
    render('searchResult', []);
    showStatus('Sẵn sàng thao tác hệ thống thư viện.');
  } catch (error) {
    showStatus(error.message, true);
  }
});
