# منصة مرصد الأداء الحكومي والقيادي - اليمن

منصة عربية أولًا، مصممة لرصد وتقييم أداء الوزارات والقيادات الحكومية في اليمن وفق منهجية قائمة على الأدلة، مع لوحات معلومات عامة وإدارية، وتقارير شهرية قابلة للطباعة، ونظام مراجعة وتوثيق للمؤشرات الحساسة.

## المزايا الرئيسية

- واجهة عربية كاملة مع دعم RTL.
- بنية أحادية المستودع تشمل `Next.js` للويب و `NestJS` للواجهة الخلفية.
- قاعدة بيانات `PostgreSQL` عبر `Prisma`.
- تقييم ديناميكي للمحاور والمؤشرات والأوزان.
- رصد حضور اجتماعات مجلس الوزراء.
- تتبع التواجد داخل اليمن وخارجها.
- توثيق التصريحات والمواقف الوطنية وربطها بالأدلة.
- سجلات تدقيق وتدفقات مراجعة للمؤشرات الحساسة.
- بوابة عامة وصفحات ملفات وتعريف بالمنهجية.

## هيكل المشروع

```text
/apps
  /api
  /web
/packages
  /shared
/docs
/scripts
```

## التشغيل السريع

1. انسخ ملف البيئة:

```bash
cp .env.example .env
```

2. ثبّت الاعتماديات:

```bash
npm install
```

3. شغّل الترحيلات والبيانات التجريبية:

```bash
npm run seed
```

4. شغّل الواجهة الخلفية:

```bash
npm run dev:api
```

5. شغّل الواجهة الأمامية:

```bash
npm run dev:web
```

## بيانات الدخول التجريبية

- مدير النظام: `admin@ygmpo.ye` / `Admin@123`
- محلل: `analyst@ygmpo.ye` / `Analyst@123`
- مراجع: `reviewer@ygmpo.ye` / `Reviewer@123`

## خارطة الطريق

- تكامل إشعارات ومهام سير العمل.
- دعم تطبيقات الهاتف عبر API مستقرة.
- أرشفة تقارير PDF وتوقيعها.
- موصل تخزين S3-compatible.

## ملخص إنجليزي

YGMPO is an Arabic-first governance observatory for Yemen that tracks ministries, ministers, attendance, presence, statements, national-position alignment, and evidence-based monthly performance scoring through a Next.js + NestJS + Prisma monorepo.
