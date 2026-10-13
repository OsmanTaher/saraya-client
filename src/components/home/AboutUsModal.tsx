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
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl p-6 md:p-7 shadow-2xl relative max-h-[90vh] overflow-y-auto text-right text-gray-800 leading-relaxed animate-in fade-in zoom-in-95 duration-200">
        
        <button
          onClick={onClose}
          className="absolute top-5 left-5 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition cursor-pointer"
        >
          ✕
        </button>

        
        <div className="border-b border-gray-100 pb-4 mb-5">
          <h2 className="text-xl md:text-2xl font-black text-indigo-700 mb-2 flex items-center gap-2">
            <span>🎓</span> عن معرض الأدوات المدرسية
          </h2>
          <p className="text-sm text-gray-600">
            مبادرة مجتمعية تهدف لتوفير أجود المستلزمات المدرسية بسعر الجملة لتخفيف الأعباء عن أولياء الأمور. صُممت هذه المنصة خصيصاً للتيسير على أهالينا وللتخلص من التكدس والازدحام أمام مقر المعرض.
          </p>
        </div>

        <div className="space-y-5 text-sm">
          
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1">
              <span>🎯</span> رؤيتنا وهدفنا
            </h3>
            <p className="text-gray-600">
              ترسيخ التكافل المجتمعي بتقديم أعلى جودة بأنسب سعر تحت شعار: «أسعار مميزة.. جودة مناسبة.. وخدمة لأهلنا».
            </p>
          </div>

          
          <div className="bg-amber-50/60 border border-amber-200/60 p-4 rounded-2xl">
            <h3 className="font-bold text-amber-950 flex items-center gap-2 mb-2">
              <span>📍</span> موعد ومكان الافتتاح
            </h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-amber-900">
              <li>• <strong>التاريخ:</strong> الثلاثاء، الموافق 25 أغسطس 2026م.</li>
              <li>• <strong>الموعد:</strong> في تمام الساعة 8:00 صباحًا.</li>
              <li>• <strong>موقع المعرض:</strong> جمعية تنمية المجتمع بتوشكى غرب (بجوار قصر الثقافة).</li>
            </ul>
          </div>

          
          <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
            <h3 className="font-bold text-indigo-950 flex items-center gap-2 mb-2">
              <span>🛒</span> كيف تطلب عبر المنصة؟
            </h3>
            <ol className="space-y-1.5 text-xs md:text-sm text-indigo-900 list-decimal list-inside">
              <li><strong>اختر الأدوات:</strong> تصفح المنتجات وأضف ما تحتاجه للسلة.</li>
              <li><strong>سجل بياناتك:</strong> اكتب الاسم ورقم الهاتف والعنوان التفصيلي بدقة.</li>
              <li><strong>احفظ رقم الطلب:</strong> بعد الإرسال، احتفظ برقم الطلب لتتمكن من متابعته أو إلغائه عند الحاجة.</li>
            </ol>
          </div>

          
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-2">
              <span>⚠️</span> ضوابط وشروط الطلب
            </h3>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>مبدأ تكافؤ الفرص:</strong> يُسمح بطلب واحد فقط لكل شخص، حرصًا على توزيع الخدمات والخصومات بعدالة على جميع أهالي القرية ومنع حجز السلع لغير المستفيدين.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>حفظ ومعالجة الطلب:</strong> يُسجل طلبك آلياً وتصل إشارة فورية لإدارة المعرض عبر Telegram للبدء في تحضيره مباشرة.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>بيانات المتابعة:</strong> احفظ رقم هاتفك ورقم طلبك في مكان آمن، فهما وسيلتك الوحيدة لعرض تفاصيل الطلب أو إلغائه.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-indigo-600 font-bold">•</span>
                <span><strong>تعديل الطلب:</strong> لتعديل طلبك، قم بإلغاء الطلب القديم أولاً من خيار «إلغاء الطلب» ثم أنشئ طلباً جديداً بنفس رقم هاتفك.</span>
              </li>
            </ul>
          </div>

          
          <div className="bg-emerald-50/70 border border-emerald-200/60 p-4 rounded-2xl">
            <h3 className="font-bold text-emerald-950 flex items-center gap-2 mb-1.5">
              <span>🤝</span> معاً لتحسين الخدمة
            </h3>
            <p className="text-xs md:text-sm text-emerald-900 leading-relaxed">
              فريق العمل متطوع بالكامل ويبذل جهداً كبيراً لإيصال طلبكم، بدايةً من مراجعة الحجوزات وتجميع المستلزمات وفرزها بدقة، وصولاً إلى مرحلة التغليف والتسليم النهائي. نرجو منكم مساعدتنا والالتزام بالبيانات والتعليمات لنتمكن من خدمتكم بأفضل صورة ممكنة.
            </p>
          </div>

          
          <div className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
            <h3 className="font-bold text-indigo-900 flex items-center gap-2">
              <span>💳</span> دفع الشراء الإلكتروني (InstaPay)
            </h3>
            <div className="text-xs md:text-sm text-gray-700 space-y-1">
              <p>
                التحويل متاح عبر تطبيق إنستاباي على الرقم:{" "}
                <span className="font-mono font-bold text-indigo-700 select-all">01080859921</span>
              </p>
              <p>
                اسم الحساب:{" "}
                <code className="bg-white px-2 py-0.5 rounded border border-gray-200 font-mono text-xs font-semibold text-slate-800">
                    ****Osman T 
                </code>
              </p>
              <p className="text-[11px] md:text-xs text-amber-700 font-medium pt-1">
                ⚠️ يُرجى كتابة (الاسم أو رقم الطلب) في خانة «غرض التحويل» لسرعة تأكيد طلبك.
              </p>
              <p className="text-[11px] md:text-xs text-amber-700 font-medium pt-1">
                📨 ثم إرسال صورة إيصال التحويل عبر WhatsApp على الرقم: 01080859921
              </p>
            </div>
          </div>
        </div>

        
        <button
          onClick={onClose}
          className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold text-sm transition shadow-xs cursor-pointer"
        >
          فهمت ذلك
        </button>
      </div>
    </div>
  );
}