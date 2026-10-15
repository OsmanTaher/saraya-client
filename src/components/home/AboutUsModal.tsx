"use client";

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutUsModal({ isOpen, onClose }: AboutUsModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      dir="rtl"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right text-gray-800 leading-relaxed animate-in fade-in zoom-in-95 duration-200 custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>

        <div className="border-b border-gray-100 pb-4 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-[#D55304] mb-2 flex items-center gap-2">
            <span>🍽️</span> عن مطعم السرايا
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            وجهتكم الأولى لأشهى المأكولات والمشويات الطازجة المحضرة بأجود أنواع
            اللحوم والمكونات البلدية 100%. صُممت هذه المنصة لتسهيل تجربة الطلب
            السريع والدفع المباشر، وتوصيل وجباتكم ساخنة وطازجة بأعلى معايير
            الجودة والنظافة.
          </p>
        </div>

        <div className="space-y-5 text-sm">
          <div>
            <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-1.5 text-base">
              <span>✨</span> رؤيتنا وشغفنا
            </h3>
            <p className="text-gray-600 leading-relaxed">
              تقديم المذاق الشرقي الأصيل بلمسة عصرية، والجمع بين الطعم الغني
              وسرعة الخدمة والأسعار التنافسية لضمان تجربة طعام لا تُنسى لكل
              أفراد العائلة.
            </p>
          </div>

          <div className="bg-amber-50/70 border border-amber-200/70 p-4 rounded-2xl">
            <h3 className="font-extrabold text-amber-950 flex items-center gap-2 mb-2 text-base">
              <span>📍</span> المقر ومواعيد العمل
            </h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-amber-900">
              <li>
                • <strong>مواعيد العمل:</strong> يومياً من الساعة 12:00 ظهراً
                وحتى 1:00 صباحاً.
              </li>
              <li>
                • <strong>العنوان:</strong> الشارع الرئيسي - بجوار موقف السرايا.
              </li>
              <li>
                • <strong>خدمة التوصيل:</strong> تغطية سريعة لجميع المناطق
                المحيطة طوال ساعات العمل.
              </li>
            </ul>
          </div>

          <div className="bg-orange-50/60 border border-[#D55304]/20 p-4 rounded-2xl">
            <h3 className="font-extrabold text-[#9A3412] flex items-center gap-2 mb-2 text-base">
              <span>🛒</span> كيف تطلب عبر المنصة؟
            </h3>
            <ol className="space-y-2 text-xs md:text-sm text-slate-800 list-decimal list-inside">
              <li>
                <strong>اختر وجبتك:</strong> تصفح قائمة المشويات والمشروبات وحدد
                الحجم والكمية، ثم أضف ملاحظاتك الخاصة.
              </li>
              <li>
                <strong>أكّد الدفع:</strong> حوّل القيمة عبر إنستاباي (InstaPay)
                أو فودافون كاش، واكتب رقمك المحول منه لتأكيد الطلب فوراً.
              </li>
              <li>
                <strong>احفظ رقم الطلب:</strong> بعد الإرسال، احتفظ برقم الطلب
                لتتمكن من معرفة حالته عبر قسم «تتبع طلبك».
              </li>
            </ol>
          </div>

          <div>
            <h3 className="font-extrabold text-gray-900 flex items-center gap-2 mb-2 text-base">
              <span>⚠️</span> ضوابط وسياسة الطلب والتجهيز
            </h3>
            <ul className="space-y-2.5 text-xs md:text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-[#D55304] font-bold">•</span>
                <span>
                  <strong>طزاجة التحضير:</strong> نبدأ في تجهيز وجبتك فور إتمام
                  عملية التحويل وتأكيدها لضمان وصول المشويات ساخنة وطازجة من
                  الشواية مباشرة.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D55304] font-bold">•</span>
                <span>
                  <strong>تعديل أو إلغاء الطلب:</strong> نظراً لسرعة تجهيز
                  الطعام، يُرجى التواصل الفوري مع الإدارة هاتفياً أو عبر واتساب
                  في حال الرغبة بالتعديل قبل بدء طهي الوجبة.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#D55304] font-bold">•</span>
                <span>
                  <strong>متابعة الطلب:</strong> رقم هاتفك ورقم الطلب هما وسيلتك
                  الأساسية لتتبع حالة استلام وتجهيز الوجبة خطوة بخطوة حتى وصول
                  مندوب التوصيل.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 bg-[#D55304] hover:bg-[#b84403] text-white py-3 rounded-xl font-extrabold text-sm transition shadow-xs cursor-pointer"
        >
          فهمت ذلك
        </button>
      </div>
    </div>
  );
}
