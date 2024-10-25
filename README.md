# familytree

إضافة فرد جديد للعائلة:

Verify

Open In Editor
Edit
Copy code
POST /api/family

المثال:
{
    "firstName": "محمد",         // الاسم الأول
    "middleName": "أحمد",        // اسم الأب
    "lastName": "العمري",        // اسم العائلة
    "gender": "male",            // الجنس (male/female)
    "birthday": "1980-05-15",    // تاريخ الميلاد
    "profession": "مهندس",       // المهنة
    "university": "جامعة اليرموك", // الجامعة
    "address": {                 // العنوان
        "street": "شارع الملك عبدالله",
        "city": "عمان",
        "country": "الأردن"
    },
    "contactInfo": {             // معلومات الاتصال
        "phone": "0777777777",
        "email": "mohammad@example.com"
    }
}
تسجيل زواج:

Verify

Open In Editor
Edit
Copy code
POST /api/family/:id/marriage

المثال:
{
    "spouseId": "60a23c5f...",    // معرف الزوج/ة
    "marriageDate": "2010-06-20"  // تاريخ الزواج
}
إضافة طفل:

Verify

Open In Editor
Edit
Copy code
POST /api/family/child

المثال:
{
    "parentIds": ["60a23c5f...", "60a23c60..."],  // معرف الوالدين
    "childData": {
        "firstName": "أحمد",
        "middleName": "محمد",
        "lastName": "العمري",
        "gender": "male",
        "birthday": "2012-03-10"
    }
}
البحث عن أفراد العائلة:

Verify

Open In Editor
Edit
Copy code
GET /api/family?lastName=العمري&gender=male

الاستجابة:
[
    {
        "_id": "60a23c5f...",
        "firstName": "محمد",
        "lastName": "العمري",
        // ... باقي المعلومات
    }
]
الحصول على شجرة العائلة:

Verify

Open In Editor
Edit
Copy code
GET /api/family/:id/tree

الاستجابة:
{
    "person": {
        "_id": "60a23c5f...",
        "firstName": "محمد",
        "lastName": "العمري"
    },
    "parents": [
        {
            "_id": "60a23c58...",
            "firstName": "أحمد",
            "lastName": "العمري"
        }
    ],
    "spouses": [
        {
            "person": {
                "_id": "60a23c60...",
                "firstName": "فاطمة",
                "lastName": "الخطيب"
            },
            "marriageDate": "2010-06-20",
            "isCurrent": true
        }
    ],
    "children": [
        {
            "_id": "60a23c62...",
            "firstName": "عمر",
            "lastName": "العمري"
        }
    ]
}
تسجيل وفاة:

Verify

Open In Editor
Edit
Copy code
POST /api/family/:id/death

المثال:
{
    "deathDate": "2023-01-15",    // تاريخ الوفاة
    "cause": "طبيعية"             // سبب الوفاة (اختياري)
}
تحديث معلومات شخص:

Verify

Open In Editor
Edit
Copy code
PUT /api/family/:id

المثال:
{
    "profession": "طبيب",          // تحديث المهنة
    "address": {                   // تحديث العنوان
        "street": "شارع المدينة المنورة",
        "city": "عمان",
        "country": "الأردن"
    },
    "contactInfo": {               // تحديث معلومات الاتصال
        "phone": "0777888888"
    }
}

إضافة عائلة كاملة:

Verify

Open In Editor
Edit
Copy code
POST /api/family/addfamily

المثال:
{
    "father": {                    // معلومات الأب
        "firstName": "محمد",
        "middleName": "أحمد",
        "lastName": "العمري",
        "birthday": "1975-03-15",
        "gender": "male"
    },
    "mother": {                    // معلومات الأم
        "firstName": "نور",
        "middleName": "محمود",
        "lastName": "الخطيب",
        "birthday": "1980-06-20",
        "gender": "female"
    },
    "children": [                  // معلومات الأطفال
        {
            "firstName": "أحمد",
            "middleName": "محمد",
            "lastName": "العمري",
            "birthday": "2005-08-10",
            "gender": "male"
        },
        {
            "firstName": "سارة",
            "middleName": "محمد",
            "lastName": "العمري",
            "birthday": "2008-11-15",
            "gender": "female"
        }
    ],
    "marriageDate": "2004-05-20"  // تاريخ زواج الوالدين
}
تسجيل طلاق:

Verify

Open In Editor
Edit
Copy code
POST /api/family/:id/divorce

المثال:
{
    "spouseId": "60a23c60...",     // معرف الزوج/ة
    "divorceDate": "2023-06-15"    // تاريخ الطلاق
}
الحصول على الأخوة والأخوات:

Verify

Open In Editor
Edit
Copy code
GET /api/family/:id/siblings

الاستجابة:
[
    {
        "_id": "60a23c62...",
        "firstName": "عمر",
        "lastName": "العمري",
        "gender": "male"
    },
    {
        "_id": "60a23c63...",
        "firstName": "سارة",
        "lastName": "العمري",
        "gender": "female"
    }
]
ملاحظات مهمة:

جميع المعرفات (IDs) يتم توليدها تلقائياً من MongoDB
التواريخ يجب أن تكون بصيغة "YYYY-MM-DD"
الجنس يجب أن يكون إما "male" أو "female"
يمكن إضافة المزيد من الحقول حسب الحاجة
جميع الطلبات تحتاج إلى معالجة الأخطاء المناسبة