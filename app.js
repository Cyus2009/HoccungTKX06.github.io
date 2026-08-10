// app.js - Logic Ứng dụng (ReactJS)

const { useState, useEffect, useRef } = React;

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [cheatWarnings, setCheatWarnings] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const canvasRef = useRef(null);

    // ==========================================
    // TÍNH NĂNG 1: GIÁM SÁT CHỐNG GIAN LẬN
    // ==========================================
    useEffect(() => {
        if (!isLoggedIn || isLocked) return;

        // Hàm phát hiện chuyển Tab hoặc thu nhỏ trình duyệt
        const handleVisibilityChange = () => {
            if (document.hidden) {
                setCheatWarnings(prev => {
                    const newCount = prev + 1;
                    // Khóa bài sau 3 lần vi phạm
                    if (newCount >= 3) setIsLocked(true); 
                    else alert(`CẢNH BÁO: Bạn vừa chuyển tab hoặc thoát màn hình!\nVi phạm lần ${newCount}/3. Nếu vi phạm 3 lần sẽ tự động nộp bài.`);
                    return newCount;
                });
            }
        };

        // Hàm khóa chuột phải và F12
        const disableContextMenu = (e) => e.preventDefault();

        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', disableContextMenu);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', disableContextMenu);
        };
    }, [isLoggedIn, isLocked]);

    // ==========================================
    // TÍNH NĂNG 2: VẼ ĐỀ THI LÊN CANVAS & ĐÓNG DẤU BẢN QUYỀN
    // ==========================================
    useEffect(() => {
        if (isLoggedIn && canvasRef.current && !isLocked) {
            const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, 800, 600);
            ctx.fillStyle = "white";
            ctx.fillRect(0, 0, 800, 600);
            
            // Vẽ đề thi bằng mã code thay vì chữ thường (Tuyệt đối không bôi đen được)
            ctx.fillStyle = "black";
            ctx.font = "bold 20px Arial";
            ctx.fillText("ĐỀ THI MÔN TIN HỌC (Chuẩn định dạng 2025)", 50, 50);
            
            ctx.font = "16px Arial";
            ctx.fillText("Câu 1 (Trắc nghiệm): Đâu là ưu điểm của kiến trúc Zero Trust?", 50, 100);
            ctx.fillText("A. Không bao giờ tin tưởng bất kỳ ai.", 70, 130);
            ctx.fillText("B. Tin tưởng mạng nội bộ mặc định.", 70, 160);
            
            ctx.fillText("Câu 2 (Đúng/Sai): Đánh giá các mệnh đề về HTML5.", 50, 210);
            ctx.fillText("a. Thẻ <canvas> cho phép vẽ đồ họa qua Javascript.", 70, 240);
            ctx.fillText("b. HTML5 không hỗ trợ phát Video trực tiếp.", 70, 270);

            // Đóng dấu Watermark chìm (Tên User + IP giả lập)
            ctx.save();
            ctx.translate(400, 300);
            ctx.rotate(-Math.PI / 4);
            ctx.fillStyle = "rgba(150, 150, 150, 0.2)"; // Màu nhạt, trong suốt
            ctx.font = "bold 45px Arial";
            ctx.fillText("TÀI KHOẢN: ADMIN - BẢO MẬT", -300, 0);
            ctx.restore();
        }
    }, [isLoggedIn, isLocked]);

    // ==========================================
    // GIAO DIỆN CÁC MÀN HÌNH
    // ==========================================
    
    // 1. Màn hình đăng nhập
    if (!isLoggedIn) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="bg-white p-8 rounded-lg shadow-xl w-96 text-center">
                    <h2 className="text-2xl font-bold mb-4 text-blue-700">Đăng Nhập Thi Thử</h2>
                    <p className="mb-6 text-sm text-gray-500">Hệ thống có bật giám sát gian lận tự động.</p>
                    <button 
                        onClick={() => setIsLoggedIn(true)}
                        className="bg-blue-600 text-white px-4 py-3 rounded font-bold hover:bg-blue-700 w-full transition-all"
                    >
                        Bắt đầu làm bài
                    </button>
                </div>
            </div>
        );
    }

    // 2. Màn hình Khóa (Khi chuyển tab 3 lần)
    if (isLocked) {
        return (
            <div className="alert-overlay">
                <h1 className="text-5xl font-bold mb-4">🚫 BÀI THI BỊ KHÓA 🚫</h1>
                <p className="text-xl font-medium">Bạn đã chuyển sang Tab khác 3 lần.</p>
                <p className="text-lg mt-2">Hệ thống đã cưỡng chế nộp bài và ghi nhận vi phạm.</p>
            </div>
        );
    }

    // 3. Màn hình Thi chính thức
    return (
        <div className="p-4 no-select max-w-4xl mx-auto">
            {/* Thanh tiêu đề & Cảnh báo */}
            <div className="flex justify-between items-center bg-white p-4 shadow-md mb-6 rounded-lg border-t-4 border-blue-600">
                <h1 className="font-bold text-xl text-gray-800">Môn: Tin Học (120 phút)</h1>
                <div className="text-red-600 font-bold bg-red-100 px-3 py-1 rounded">
                    Cảnh báo chuyển Tab: {cheatWarnings}/3
                </div>
            </div>

            {/* Vùng hiển thị PDF (Canvas) */}
            <div className="bg-white p-2 shadow-md rounded-lg flex justify-center border border-gray-200">
                <canvas ref={canvasRef} width="800" height="350" className="max-w-full rounded"></canvas>
            </div>

            {/* Khung điền đáp án */}
            <div className="mt-6 bg-white p-6 shadow-md rounded-lg border border-gray-200">
                <h3 className="font-bold text-lg mb-4 text-gray-700 border-b pb-2">Phiếu Trả Lời:</h3>
                <div className="grid grid-cols-2 gap-6">
                    
                    {/* Dạng Trắc nghiệm 1 đáp án */}
                    <div className="bg-blue-50 p-4 rounded border border-blue-100">
                        <label className="block text-md font-bold mb-2">Câu 1 (Trắc nghiệm):</label>
                        <select className="border-2 border-gray-300 p-2 rounded w-full bg-white focus:outline-none focus:border-blue-500">
                            <option>--- Chọn đáp án ---</option>
                            <option>A</option>
                            <option>B</option>
                            <option>C</option>
                            <option>D</option>
                        </select>
                    </div>

                    {/* Dạng Đúng/Sai 4 mệnh đề */}
                    <div className="bg-yellow-50 p-4 rounded border border-yellow-100">
                        <label className="block text-md font-bold mb-2">Câu 2 (Đúng / Sai):</label>
                        <div className="flex gap-4 items-center mb-2">
                            <span className="font-semibold">Mệnh đề a:</span>
                            <select className="border-2 p-1 rounded bg-white"><option>-</option><option>Đúng</option><option>Sai</option></select>
                        </div>
                        <div className="flex gap-4 items-center">
                            <span className="font-semibold">Mệnh đề b:</span>
                            <select className="border-2 p-1 rounded bg-white"><option>-</option><option>Đúng</option><option>Sai</option></select>
                        </div>
                    </div>
                </div>
                
                <div className="mt-6 text-right">
                    <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 shadow-lg transition-all">
                        Nộp Bài Thi
                    </button>
                </div>
            </div>
        </div>
    );
}

// Khởi động ứng dụng
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
