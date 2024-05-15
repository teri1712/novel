import { Check, X } from "lucide-react";

const CheckList = () => {
  const checkList = [
    { name: "Homepage", status: false },
    { name: "Thanh tìm kiếm", status: false },
    { name: "Trang danh sách truyện", status: false },
    { name: "Trang chi tiết thông tin/các chương truyện", status: false },
    { name: "Trang đọc truyện", status: false },
    { name: "Điều hướng chuyển trang truyện", status: false },
    { name: "Tính năng export truyện", status: false },
    { name: "Tính năng tải truyện", status: false },
  ];

  const techs = [
    {name: "React", link: "https://react.dev/"},
    {name: "TailwindCSS", link: "https://tailwindcss.com/"},
    {name: "Vite", link: "https://vitejs.dev/"},
    {name: "Đồ án của tui", link: "https://www.github.com/salesync-org/salesync"}
  ];
  return (
    <>
      <p className="font-semibold text-[3rem]">System Design Final Project Checklist</p>
      <div className="card w-fit mx-auto">
        <h1 className="font-semibold text-xl my-4">
          Các page/component cần xây dựng
        </h1>
        {checkList.map((item) => (
          <div key={item.name} className="flex justify-between items-center">
            <p>{item.name}</p>
            <div className="px-2">
              {item.status ? <Check color="#00ff00"></Check> : <X></X>}
            </div>
          </div>
        ))}
        <div className="mt-4">
          <h1 className="font-semibold text-xl my-4">Tham Khảo</h1>
          <div className="flex space-x-4">
          {techs.map((item) => (
            <a key={item.name} href
            ={item.link}>
              <p className="text-sm rounded-full py-2 px-4 border-2 text-black dark:text-white">
            {item.name}
          </p>
            </a>
          ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckList;
