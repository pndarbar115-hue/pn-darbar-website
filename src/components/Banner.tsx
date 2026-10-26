export default function Banner() {
  return (
    <div className="mx-auto mb-4 max-w-3xl rounded-xl gold-border bg-black/50 px-3 py-2 text-center">
      <p className="text-[11px] leading-relaxed text-amber-200/80 sm:text-xs">
        <span className="font-semibold text-amber-300">डेमो मोड:</span> टॉस फ़िल्टर नमूना डेटा पर
        चल रहा है। असली टेलीग्राम कनेक्शन अभी कॉन्फ़िगर नहीं हुआ है। काउंटर आपके डिवाइस पर
        लोकल स्टोरेज में सेव होते हैं।
      </p>
    </div>
  );
}
