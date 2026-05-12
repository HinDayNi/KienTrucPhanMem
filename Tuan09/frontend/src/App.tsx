import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  UserRound,
  Users,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Screen = "home" | "login" | "details" | "success";

type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

type Tour = {
  id: string;
  name: string;
  location: string;
  price: number;
  duration: string;
  availableSlots: number;
  description: string;
};

type BookingResult = {
  success: boolean;
  message: string;
  user: User;
  tour: Tour;
  booking: {
    id: string;
    quantity: number;
    totalAmount: number;
    status: string;
    createdAt: string;
  };
  payment: {
    id: string;
    amount: number;
    method: string;
    status: "SUCCESS" | "FAIL";
    message: string;
  };
  confirmation: string | null;
};

const ORCHESTRATOR_URL =
  import.meta.env.VITE_ORCHESTRATOR_URL || "http://10.11.58.156:8080";

async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${ORCHESTRATOR_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(payload?.message || "Không thể kết nối đến Orchestrator");
  }

  return payload as T;
}

const TravelArtwork = ({
  className = "",
  index,
  title,
}: {
  className?: string;
  index: number;
  title: string;
}) => {
  const variants = [
    "bg-[linear-gradient(135deg,#F7F3EF_0%,#F7F3EF_42%,#D4A017_42%,#D4A017_58%,#222_58%,#222_100%)]",
    "bg-[linear-gradient(135deg,#222_0%,#222_36%,#EAE4DD_36%,#EAE4DD_68%,#D4A017_68%,#D4A017_100%)]",
    "bg-[linear-gradient(135deg,#D6D2CB_0%,#D6D2CB_35%,#F7F3EF_35%,#F7F3EF_70%,#1A1A1A_70%,#1A1A1A_100%)]",
  ];

  return (
    <div
      aria-label={title}
      className={`relative overflow-hidden ${variants[index % variants.length]} ${className}`}
      role="img"
    >
      <div className="absolute inset-x-0 bottom-0 h-1/3 border-t border-ink/40 bg-canvas/35" />
      <div className="absolute left-[12%] top-[18%] h-[18%] w-[42%] border border-ink/60 bg-canvas/40" />
      <div className="absolute right-[10%] top-[32%] h-[34%] w-[24%] border border-ink/60 bg-white/35" />
      <div className="absolute left-[18%] bottom-[18%] h-[1px] w-[70%] bg-ink/60" />
      <div className="absolute left-[26%] bottom-[26%] h-[1px] w-[52%] bg-ink/50" />
      <div className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.2em] font-bold text-ink bg-canvas/85 px-sm py-1 border border-ink">
        Minh họa LAN
      </div>
    </div>
  );
};

function currency(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
}

function shortDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

const Navbar = ({
  currentScreen,
  user,
  onLogout,
  onNavigate,
}: {
  currentScreen: Screen;
  user: User | null;
  onLogout: () => void;
  onNavigate: (screen: Screen) => void;
}) => {
  return (
    <nav className="bg-canvas sticky top-0 w-full z-50 border-b border-ink">
      <div className="flex justify-between items-end px-lg py-md max-w-[1280px] mx-auto">
        <div className="flex items-end gap-xl">
          <button
            onClick={() => onNavigate("home")}
            className="font-display italic text-[24px] text-ink font-bold tracking-tighter cursor-pointer"
          >
            MiniMax Tours
          </button>
          {currentScreen !== "login" && (
            <div className="hidden md:flex items-center gap-xl text-[10px] uppercase tracking-[0.2em]">
              <button
                onClick={() => onNavigate("home")}
                className={`pb-1 ${
                  currentScreen === "home" || currentScreen === "details"
                    ? "border-b border-ink"
                    : "text-ink-subtle hover:text-ink cursor-pointer transition-colors"
                }`}
              >
                Chuyến đi
              </button>
              <span className="text-ink-subtle">Orchestration SOA</span>
              <span className="text-ink-subtle">Chỉ chạy LAN</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-lg">
          {currentScreen === "login" ? (
            <button
              onClick={() => onNavigate("home")}
              className="text-ink font-bold text-[10px] uppercase tracking-widest hover:underline cursor-pointer"
            >
              Quay lại trang chủ
            </button>
          ) : user ? (
            <>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-ink-subtle">
                {user.name}
              </span>
              <button
                onClick={onLogout}
                className="bg-ink text-white rounded-full px-lg py-sm font-medium text-[12px] uppercase tracking-widest hover:bg-ink-muted transition-colors cursor-pointer"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("login")}
              className="bg-ink text-white rounded-full px-lg py-sm font-medium text-[12px] uppercase tracking-widest hover:bg-ink-muted transition-colors cursor-pointer"
            >
              Đăng nhập
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="border-t border-ink bg-canvas text-ink w-full mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-start px-lg md:px-section py-xl max-w-[1280px] mx-auto gap-xl">
        <div className="flex flex-col gap-md">
          <span className="font-display italic text-[32px] font-bold tracking-tighter">
            MiniMax Tours
          </span>
          <p className="text-[10px] uppercase tracking-widest text-ink-muted">
            Frontend chỉ gọi Orchestrator Service
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-xl">
          <div className="flex flex-col gap-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] mb-xs">
              API
            </h4>
            <span className="text-[11px] text-ink-muted">/login</span>
            <span className="text-[11px] text-ink-muted">/book-tour</span>
          </div>
          <div className="flex flex-col gap-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] mb-xs">
              Service
            </h4>
            <span className="text-[11px] text-ink-muted">Orchestrator</span>
            <span className="text-[11px] text-ink-muted">REST API</span>
          </div>
          <div className="flex flex-col gap-sm">
            <h4 className="font-bold text-[10px] uppercase tracking-[0.2em] mb-xs">
              LAN
            </h4>
            <span className="text-[11px] text-ink-muted">{ORCHESTRATOR_URL}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const HomeScreen = ({
  error,
  isLoading,
  onNavigate,
  onReload,
  onSelectTour,
  tours,
}: {
  error: string | null;
  isLoading: boolean;
  onNavigate: (screen: Screen) => void;
  onReload: () => void;
  onSelectTour: (tour: Tour) => void;
  tours: Tour[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-grow w-full max-w-[1280px] mx-auto px-lg md:px-section py-section relative"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-xxl mb-section">
        <div className="lg:col-span-1">
          <div className="font-display text-[120px] font-black leading-[0.8] mb-lg opacity-10">
            {String(tours.length || 0).padStart(2, "0")}
          </div>
          <h1 className="text-[48px] leading-none font-bold text-ink mb-md uppercase">
            Tour
            <br />
            Tuyển chọn.
          </h1>
          <p className="text-[14px] leading-[1.6] text-ink-subtle max-w-[300px]">
            Dữ liệu tour được lấy từ Tour Service thông qua Orchestrator. Flow
            đặt tour sẽ đi qua User, Tour, Booking và Payment Service.
          </p>
          <button
            onClick={onReload}
            className="mt-xl border border-ink px-lg py-sm text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-ink hover:text-white transition-all"
          >
            Tải lại tour
          </button>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-lg">
          {isLoading &&
            Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="border border-ink h-[360px] bg-secondary-fixed-dim animate-pulse"
              />
            ))}

          {!isLoading && error && (
            <div className="md:col-span-2 border border-semantic-error bg-error-container p-xl">
              <h2 className="font-display italic text-[32px] font-bold text-ink mb-sm">
                Không kết nối được backend
              </h2>
              <p className="text-[13px] leading-[1.6] text-ink-subtle mb-lg">{error}</p>
              <p className="text-[11px] uppercase tracking-widest text-ink-muted">
                Kiểm tra Orchestrator tại {ORCHESTRATOR_URL}
              </p>
            </div>
          )}

          {!isLoading &&
            !error &&
            tours.map((tour, index) => (
              <div
                key={tour.id}
                className={`relative p-lg border border-ink flex flex-col justify-between h-[380px] transition-all hover:scale-[1.02] duration-300 group ${
                  index % 3 === 1 ? "bg-tertiary-fixed" : "bg-primary-fixed"
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] block mb-sm">
                    // {tour.location}
                  </span>
                  <h2 className="text-[30px] leading-none font-bold uppercase mb-md">
                    {tour.name}
                  </h2>
                  <div className="aspect-[16/9] overflow-hidden border border-ink grayscale group-hover:grayscale-0 transition-all">
                    <TravelArtwork className="w-full h-full" index={index} title={tour.name} />
                  </div>
                </div>
                <div className="flex justify-between items-end gap-md">
                  <div>
                    <p className="text-[12px] leading-[1.4] max-w-[260px] opacity-80 line-clamp-2">
                      {tour.description}
                    </p>
                    <p className="mt-sm text-[11px] uppercase tracking-widest font-bold">
                      {currency(tour.price)} / khách
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      onSelectTour(tour);
                      onNavigate("details");
                    }}
                    className="w-12 h-12 rounded-full border border-ink flex items-center justify-center bg-white text-ink hover:bg-ink hover:text-white transition-all shrink-0"
                    aria-label={`Xem ${tour.name}`}
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
                <div className="absolute top-4 right-4 text-[10px] uppercase tracking-widest opacity-50">
                  {tour.availableSlots} chỗ
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
};

const LoginScreen = ({
  onLogin,
  onNavigate,
}: {
  onLogin: (user: User) => void;
  onNavigate: (screen: Screen) => void;
}) => {
  const [email, setEmail] = useState("truong@example.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const result = await apiRequest<{ success: boolean; user: User; token: string }>(
        "/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      );

      onLogin(result.user);
      onNavigate("home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Đăng nhập thất bại");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex-grow flex items-center justify-center px-lg py-section w-full">
      <div className="w-full max-w-[448px] bg-canvas border border-ink p-12 md:p-16 shadow-lg relative mx-auto">
        <div className="absolute -top-6 -left-6 font-display italic text-[48px] font-bold opacity-10 select-none pointer-events-none">
          Sign In
        </div>
        <div className="text-center mb-xl">
          <h1 className="font-display italic text-[40px] font-bold text-ink mb-xs">
            Đăng nhập
          </h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-ink-subtle">
            Gọi API qua Orchestrator
          </p>
        </div>

        {error && (
          <div className="mb-lg border border-semantic-error bg-error-container px-md py-sm text-[12px] text-on-error-container">
            {error}
          </div>
        )}

        <form className="space-y-xl" onSubmit={handleSubmit}>
          <div className="space-y-xs">
            <label
              className="text-[10px] uppercase tracking-widest font-bold text-ink block"
              htmlFor="email"
            >
              Địa chỉ email
            </label>
            <input
              className="w-full px-0 py-sm bg-transparent border-b border-ink/30 text-[16px] text-ink focus:border-ink outline-none transition-colors"
              id="email"
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
              type="email"
              value={email}
            />
          </div>
          <div className="space-y-xs">
            <label
              className="text-[10px] uppercase tracking-widest font-bold text-ink block"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <input
              className="w-full px-0 py-sm bg-transparent border-b border-ink/30 text-[16px] text-ink focus:border-ink outline-none transition-colors"
              id="password"
              onChange={(event) => setPassword(event.target.value)}
              placeholder="123456"
              required
              type="password"
              value={password}
            />
          </div>
          <button
            className="w-full border border-ink text-ink font-bold text-[12px] uppercase tracking-[0.2em] py-md hover:bg-ink hover:text-white transition-all flex justify-center items-center gap-md mt-xl cursor-pointer disabled:opacity-60"
            disabled={isSubmitting}
            type="submit"
          >
            {isSubmitting ? "Đang xử lý..." : "Đăng nhập"}
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-xl text-center text-[11px] uppercase tracking-widest text-ink-subtle">
          Demo: truong@example.com / 123456
        </div>
      </div>
    </div>
  );
};

const DetailsScreen = ({
  bookingError,
  isBooking,
  onBookTour,
  onNavigate,
  selectedTour,
  user,
}: {
  bookingError: string | null;
  isBooking: boolean;
  onBookTour: (quantity: number) => void;
  onNavigate: (screen: Screen) => void;
  selectedTour: Tour | null;
  user: User | null;
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!selectedTour) {
    return (
      <div className="max-w-[1280px] mx-auto px-lg py-section">
        <div className="border border-ink p-xl">
          <h1 className="font-display italic text-[40px] font-bold mb-md">
            Chưa chọn tour
          </h1>
          <button
            onClick={() => onNavigate("home")}
            className="border border-ink px-lg py-sm text-[10px] uppercase tracking-[0.2em] font-bold"
          >
            Về danh sách tour
          </button>
        </div>
      </div>
    );
  }

  const imageIndex = Math.max(0, Number(selectedTour.id.replace(/\D/g, "")) - 1);
  const totalAmount = selectedTour.price * quantity;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-[1280px] mx-auto px-lg py-section"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-xxl mb-section">
        <div className="lg:col-span-6 flex flex-col justify-center">
          <div className="flex items-center gap-xl mb-lg flex-wrap">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-ink border border-ink px-sm py-1">
              {selectedTour.location}
            </span>
            <span className="flex items-center text-ink-muted text-[10px] uppercase tracking-widest">
              <Clock className="mr-xxs" size={14} />
              {selectedTour.duration}
            </span>
            <span className="flex items-center text-ink-muted text-[10px] uppercase tracking-widest">
              <Users className="mr-xxs" size={14} />
              {selectedTour.availableSlots} chỗ
            </span>
          </div>
          <h1 className="font-display text-[58px] leading-none font-bold text-ink mb-md uppercase">
            {selectedTour.name}
          </h1>
          <p className="text-[14px] leading-[1.6] text-ink-subtle mb-xxl max-w-[520px]">
            {selectedTour.description}
          </p>

          {!user && (
            <div className="mb-lg border border-ink bg-primary-fixed px-md py-sm text-[12px]">
              Bạn cần đăng nhập trước khi đặt tour.
            </div>
          )}

          {bookingError && (
            <div className="mb-lg border border-semantic-error bg-error-container px-md py-sm text-[12px] text-on-error-container">
              {bookingError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-xl">
            <div className="flex items-center border border-ink h-12">
              <button
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                className="w-12 h-full border-r border-ink hover:bg-ink hover:text-white transition-all"
                type="button"
              >
                -
              </button>
              <span className="w-16 text-center font-bold">{quantity}</span>
              <button
                onClick={() =>
                  setQuantity((value) => Math.min(selectedTour.availableSlots, value + 1))
                }
                className="w-12 h-full border-l border-ink hover:bg-ink hover:text-white transition-all"
                type="button"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                if (!user) {
                  onNavigate("login");
                  return;
                }
                onBookTour(quantity);
              }}
              className="w-40 h-40 rounded-full border border-ink text-ink font-bold text-[10px] uppercase tracking-[0.2em] hover:bg-ink hover:text-white transition-all flex items-center justify-center text-center p-xl disabled:opacity-60"
              disabled={isBooking}
            >
              {isBooking ? "Đang đặt..." : "Đặt ngay"}
              <ArrowRight className="ml-sm" size={16} />
            </button>

            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-ink-muted mb-xs">
                Tổng tiền
              </span>
              <span className="font-display italic text-[32px] font-bold text-ink">
                {currency(totalAmount)}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 relative">
          <div className="bg-canvas p-xs border border-ink relative">
            <div className="aspect-[4/5] overflow-hidden relative">
              <TravelArtwork
                className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                index={imageIndex}
                title={selectedTour.name}
              />
              <div className="absolute top-4 right-4 bg-canvas border border-ink px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                {selectedTour.id}
              </div>
              <div className="absolute bottom-4 left-4 bg-canvas border border-ink px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                {currency(selectedTour.price)} / khách
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px] bg-ink mb-section border border-ink">
        <div className="bg-canvas p-xl flex flex-col justify-between min-h-[180px]">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-md opacity-40">
            01 // User
          </div>
          <div>
            <h3 className="font-display italic text-[24px] font-bold text-ink mb-sm">
              Xác thực người dùng
            </h3>
            <p className="text-[13px] leading-[1.6] text-ink-subtle">
              Orchestrator kiểm tra User Service bằng userId đang đăng nhập.
            </p>
          </div>
        </div>
        <div className="bg-[#D4A017] p-xl flex flex-col justify-between min-h-[180px]">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-md text-white/60">
            02 // Booking
          </div>
          <div>
            <h3 className="font-display italic text-[24px] font-bold text-white mb-sm">
              Tạo booking
            </h3>
            <p className="text-[13px] leading-[1.6] text-white/80">
              Booking Service tạo phiếu đặt tour với tổng tiền đã tính.
            </p>
          </div>
        </div>
        <div className="bg-[#222] p-xl flex flex-col justify-between min-h-[180px]">
          <div className="text-[10px] uppercase tracking-[0.2em] font-bold mb-md text-white/40">
            03 // Payment
          </div>
          <div>
            <h3 className="font-display italic text-[24px] font-bold text-white mb-sm">
              Thanh toán
            </h3>
            <p className="text-[13px] leading-[1.6] text-white/70">
              Payment Service random thành công hoặc thất bại theo yêu cầu bài tập.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const SuccessScreen = ({
  bookingResult,
  onNavigate,
}: {
  bookingResult: BookingResult | null;
  onNavigate: (screen: Screen) => void;
}) => {
  const success = bookingResult?.payment.status === "SUCCESS";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex-grow flex items-center justify-center p-md md:p-section"
    >
      <div className="w-full max-w-[900px] flex flex-col items-center">
        <div className="flex flex-col items-center text-center gap-md mb-xxl">
          <div
            className={`w-xxl h-xxl rounded-full flex items-center justify-center mb-sm ${
              success ? "bg-semantic-success/10" : "bg-error-container"
            }`}
          >
            <span
              className={`${
                success ? "text-semantic-success" : "text-semantic-error"
              }`}
            >
              {success ? <CheckCircle2 size={48} /> : <AlertCircle size={48} />}
            </span>
          </div>
          <h1 className="font-display text-[56px] font-bold text-ink uppercase">
            {success ? "Đặt tour thành công" : "Thanh toán thất bại"}
          </h1>
          <p className="text-[12px] uppercase tracking-[0.2em] text-ink-subtle max-w-[560px]">
            {bookingResult?.message || "Chưa có kết quả đặt tour"}
          </p>
        </div>

        {bookingResult && (
          <div className="w-full bg-ink p-[1px] grid grid-cols-1 md:grid-cols-3 gap-[1px] border border-ink shadow-2xl">
            <div className="bg-canvas p-lg md:col-span-2 flex flex-col justify-between min-h-[160px]">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                Tour
              </span>
              <div className="mt-auto">
                <h2 className="font-display italic text-[32px] font-bold text-ink">
                  {bookingResult.tour.name}
                </h2>
                <div className="flex items-center gap-xs mt-xs text-ink-muted text-[10px] uppercase tracking-widest">
                  <UserRound size={14} />
                  <span>{bookingResult.user.name}</span>
                </div>
              </div>
            </div>
            <div className="bg-canvas p-lg flex flex-col justify-between min-h-[160px]">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                Mã booking
              </span>
              <span className="font-display italic text-[20px] font-bold text-ink mt-auto break-all">
                {bookingResult.booking.id}
              </span>
            </div>
            <div className="bg-canvas p-lg flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                Ngày tạo
              </span>
              <span className="font-bold text-[16px] text-ink mt-auto">
                {shortDate(bookingResult.booking.createdAt)}
              </span>
            </div>
            <div className="bg-canvas p-lg flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                Tổng tiền
              </span>
              <span className="font-bold text-[18px] text-ink mt-auto">
                {currency(bookingResult.booking.totalAmount)}
              </span>
            </div>
            <div className="bg-canvas p-lg flex flex-col justify-between min-h-[140px]">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                Trạng thái
              </span>
              <div className="flex items-center gap-sm mt-auto">
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    success ? "bg-semantic-success" : "bg-semantic-error"
                  }`}
                />
                <span className="text-[12px] font-bold text-ink uppercase tracking-[0.2em]">
                  {bookingResult.booking.status}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row items-center gap-md mt-xxl">
          <button
            onClick={() => onNavigate("home")}
            className="inline-flex items-center justify-center gap-xs bg-canvas border border-ink text-ink font-bold text-[10px] uppercase tracking-[0.2em] px-lg py-sm hover:bg-ink hover:text-white transition-all"
          >
            <ArrowLeft size={16} />
            Quay lại
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [tours, setTours] = useState<Tour[]>([]);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [bookingResult, setBookingResult] = useState<BookingResult | null>(null);
  const [tourError, setTourError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [isLoadingTours, setIsLoadingTours] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  const selectedOrFirstTour = useMemo(
    () => selectedTour || tours[0] || null,
    [selectedTour, tours],
  );

  async function loadTours() {
    setIsLoadingTours(true);
    setTourError(null);

    try {
      const result = await apiRequest<{ success: boolean; tours: Tour[] }>("/tours");
      setTours(result.tours);
      setSelectedTour((current) => current || result.tours[0] || null);
    } catch (err) {
      setTourError(err instanceof Error ? err.message : "Không tải được tour");
    } finally {
      setIsLoadingTours(false);
    }
  }

  async function bookTour(quantity: number) {
    if (!user || !selectedOrFirstTour) {
      setScreen("login");
      return;
    }

    setIsBooking(true);
    setBookingError(null);

    try {
      const result = await apiRequest<BookingResult>("/book-tour", {
        method: "POST",
        body: JSON.stringify({
          userId: user.id,
          tourId: selectedOrFirstTour.id,
          quantity,
          paymentMethod: "BANK_TRANSFER",
        }),
      });

      setBookingResult(result);
      setScreen("success");
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : "Đặt tour thất bại");
    } finally {
      setIsBooking(false);
    }
  }

  useEffect(() => {
    void loadTours();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-canvas font-sans overflow-x-hidden">
      <Navbar
        currentScreen={screen}
        onLogout={() => {
          setUser(null);
          setBookingResult(null);
          setScreen("home");
        }}
        onNavigate={setScreen}
        user={user}
      />
      <main className="flex-grow flex flex-col w-full">
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              className="flex-grow flex flex-col w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <HomeScreen
                error={tourError}
                isLoading={isLoadingTours}
                onNavigate={setScreen}
                onReload={loadTours}
                onSelectTour={setSelectedTour}
                tours={tours}
              />
            </motion.div>
          )}
          {screen === "login" && (
            <motion.div
              key="login"
              className="flex-grow flex flex-col w-full"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <LoginScreen onLogin={setUser} onNavigate={setScreen} />
            </motion.div>
          )}
          {screen === "details" && (
            <motion.div
              key="details"
              className="flex-grow flex flex-col w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <DetailsScreen
                bookingError={bookingError}
                isBooking={isBooking}
                onBookTour={bookTour}
                onNavigate={setScreen}
                selectedTour={selectedOrFirstTour}
                user={user}
              />
            </motion.div>
          )}
          {screen === "success" && (
            <motion.div
              key="success"
              className="flex-grow flex flex-col w-full"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <SuccessScreen bookingResult={bookingResult} onNavigate={setScreen} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
