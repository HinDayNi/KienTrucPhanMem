const BookFactory = require('./factory/BookFactory');
const SearchContext = require('./strategy/SearchContext');
const SearchByTitle = require('./strategy/SearchByTitle');
const SearchByAuthor = require('./strategy/SearchByAuthor');
const SearchByGenre = require('./strategy/SearchByGenre');
const NotificationCenter = require('./observer/NotificationCenter');
const Subscriber = require('./observer/Subscriber');
const BorrowBase = require('./decorator/BorrowBase');
const ExtendLoanDecorator = require('./decorator/ExtendLoanDecorator');
const SpecialEditionDecorator = require('./decorator/SpecialEditionDecorator');

class Library {
  constructor() {
    this.books = [];
    this.loans = [];
    this.notifications = [];
    this.bookSeed = 1000;
    this.loanSeed = 1;
    this.notificationCenter = new NotificationCenter();

    this.notificationCenter.subscribe(new Subscriber('Thu thu A', 'staff'));
    this.notificationCenter.subscribe(new Subscriber('Ban doc theo doi', 'subscriber'));

    this._seedBooks();
  }

  static getInstance() {
    if (!Library.instance) {
      Library.instance = new Library();
    }
    return Library.instance;
  }

  _seedBooks() {
    this.addBook({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      genre: 'Software Engineering',
      type: 'paper'
    });
    this.addBook({
      title: 'Design Patterns',
      author: 'Erich Gamma',
      genre: 'Architecture',
      type: 'ebook'
    });
    this.addBook({
      title: 'Refactoring',
      author: 'Martin Fowler',
      genre: 'Architecture',
      type: 'audio'
    });
  }

  _emit(event) {
    const logs = this.notificationCenter.notify(event);
    const record = {
      id: Date.now() + Math.random(),
      event,
      logs,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(record);
    return record;
  }

  _nextBookId() {
    this.bookSeed += 1;
    return `B${this.bookSeed}`;
  }

  _nextLoanId() {
    const id = this.loanSeed;
    this.loanSeed += 1;
    return `L${id}`;
  }

  listBooks() {
    return this.books;
  }

  addBook(payload) {
    const title = (payload.title || '').trim();
    const author = (payload.author || '').trim();
    const genre = (payload.genre || '').trim();
    const type = payload.type || 'paper';

    if (!title || !author || !genre) {
      throw new Error('Thong tin sach chua day du.');
    }

    const book = BookFactory.createBook(type, {
      id: this._nextBookId(),
      title,
      author,
      genre
    });

    this.books.push(book);
    this._emit(`Sach moi duoc them: ${book.title} (${book.type})`);
    return book;
  }

  searchBooks(by, keyword) {
    const cleanKeyword = (keyword || '').trim();
    if (!cleanKeyword) {
      return [];
    }

    const context = new SearchContext(new SearchByTitle());
    if (by === 'author') {
      context.setStrategy(new SearchByAuthor());
    } else if (by === 'genre') {
      context.setStrategy(new SearchByGenre());
    }

    return context.execute(this.books, cleanKeyword);
  }

  registerObserver(name, role) {
    const cleanName = (name || '').trim();
    if (!cleanName) {
      throw new Error('Ten nguoi theo doi khong hop le.');
    }
    this.notificationCenter.subscribe(new Subscriber(cleanName, role || 'subscriber'));
    return this.notificationCenter.listObservers();
  }

  listObservers() {
    return this.notificationCenter.listObservers();
  }

  borrowBook(payload) {
    const { bookId, borrowerName, extendDays, specialEdition } = payload;
    const cleanBorrower = (borrowerName || '').trim();

    if (!bookId || !cleanBorrower) {
      throw new Error('Thong tin muon sach khong day du.');
    }

    const book = this.books.find((item) => item.id === bookId);
    if (!book) {
      throw new Error('Khong tim thay sach can muon.');
    }
    if (!book.available) {
      throw new Error('Sach hien tai dang duoc muon.');
    }

    let borrowFlow = new BorrowBase(book, cleanBorrower);

    const extra = Number(extendDays) || 0;
    if (extra > 0) {
      borrowFlow = new ExtendLoanDecorator(borrowFlow, extra);
    }

    if (specialEdition) {
      borrowFlow = new SpecialEditionDecorator(borrowFlow, specialEdition);
    }

    const now = new Date();
    const dueDate = new Date(now);
    dueDate.setDate(dueDate.getDate() + borrowFlow.getBorrowDays());

    book.available = false;

    const loan = {
      id: this._nextLoanId(),
      bookId: book.id,
      bookTitle: book.title,
      borrowerName: cleanBorrower,
      borrowDate: now.toISOString(),
      dueDate: dueDate.toISOString(),
      features: borrowFlow.getFeatures(),
      returned: false,
      overdueNotified: false
    };

    this.loans.push(loan);
    return loan;
  }

  returnBook(loanId) {
    const loan = this.loans.find((item) => item.id === loanId);
    if (!loan) {
      throw new Error('Khong tim thay phieu muon.');
    }
    if (loan.returned) {
      throw new Error('Phieu muon nay da tra sach.');
    }

    loan.returned = true;
    loan.returnDate = new Date().toISOString();

    const book = this.books.find((item) => item.id === loan.bookId);
    if (book) {
      book.available = true;
    }

    return loan;
  }

  listLoans() {
    return this.loans;
  }

  checkOverdue() {
    const now = new Date();
    const overdueLoans = this.loans.filter((loan) => {
      return !loan.returned && new Date(loan.dueDate) < now;
    });

    const events = [];
    overdueLoans.forEach((loan) => {
      if (!loan.overdueNotified) {
        loan.overdueNotified = true;
        const note = this._emit(`Sach qua han: ${loan.bookTitle} - nguoi muon ${loan.borrowerName}`);
        events.push(note);
      }
    });

    return { overdueLoans, events };
  }

  listNotifications() {
    return this.notifications;
  }
}

module.exports = Library;
