import Logo from "../assets/updated-logo.svg";

const Welcome = ({ onConfirm }: { onConfirm: () => void }) => {
  return (
    <div className={"flex justify-center "}>
      <div className={" mt-[70px] w-[252px] "}>
        <div className={"flex justify-center "}>
          <img className={"mb-[30px] w-[137px] h-[114px]"} src={Logo} alt="#" />
        </div>
        <p className={"text-[24px] font-semibold "}>Welcome to Lingo</p>

        <p className={"text-[16px] text-[#413C3A] mt-[12px] mb-[46px]"}>
          Thank you for Downloading❤️. Unlock limitless global potential for
          your designs
        </p>
        <button
          onClick={onConfirm}
          className={
            "bg-[#100F0E] text-xs rounded-[24px] py-[30px] text-white w-full "
          }
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Welcome;
