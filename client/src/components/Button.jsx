function Button({ children, className = "", disabled, type = "button" }) {
  return (
    <button
      className={`text-white px-6 py-1 w-full border-2 border-primary/20 hover:text-primary duration-200 bg-[#101113] rounded-2xl ${className} disabled:opacity-50 text-[13px] font-normal font-custom`}
      disabled={disabled}
      type={type}
    >
      {children}
    </button>
  );
}

export default Button;
