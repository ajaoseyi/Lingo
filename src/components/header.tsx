import Logo from '../assets/lingo-variant-logo.svg'
const Header = () => {
  return (
      <div className={"text-[#2C2C2C] py-4 px-7 bg-[#2C2C2C] mb-6 flex gap-[9px] items-center"}>
          <img className={'w-[28px] h-[30px]'} src={Logo} alt='#'/>
        <p
          className={"text-2xl font-semibold text-white text-[20px] text-left"}
        >
          Lingo
        </p>
      </div>
  );
}

export default Header