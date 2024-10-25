const FamilyMember = require('../models/FamilyMember');

// إنشاء فرد جديد في العائلة
async function createFamilyMember(data) {
  try {
    const member = new FamilyMember(data);
    await member.save();
    return member;
  } catch (error) {
    throw new Error(`خطأ في إنشاء فرد جديد: ${error.message}`);
  }
}

// إضافة فرد جديد مع العلاقات العائلية
async function addFamilyMember(data) {
  try {
    const {
      firstName,
      middleName,
      lastName,
      gender,
      birthday,
      university,
      profession,
      parentIds,
      spouseId,
      marriageDate,
      address,
      contactInfo
    } = data;

    const newMember = await createFamilyMember({
      firstName,
      middleName,
      lastName,
      gender,
      birthday,
      university,
      profession,
      parents: parentIds || [],
      address,
      contactInfo
    });

    // إضافة العلاقات مع الوالدين
    if (parentIds && parentIds.length > 0) {
      for (const parentId of parentIds) {
        const parent = await FamilyMember.findById(parentId);
        if (!parent) {
          throw new Error(`لم يتم العثور على الوالد/ة برقم ${parentId}`);
        }

        const otherParentId = parentIds.find(id => id !== parentId);
        parent.children.push({
          child: newMember._id,
          otherParent: otherParentId
        });

        await parent.save();
      }
    }

    // إضافة العلاقة مع الزوج/ة
    if (spouseId) {
      const spouse = await FamilyMember.findById(spouseId);
      if (!spouse) {
        throw new Error('لم يتم العثور على الزوج/ة');
      }

      newMember.spouses.push({
        person: spouseId,
        marriageDate: marriageDate || new Date(),
        isCurrent: true
      });

      spouse.spouses.push({
        person: newMember._id,
        marriageDate: marriageDate || new Date(),
        isCurrent: true
      });

      await spouse.save();
      await newMember.save();
    }

    return newMember;
  } catch (error) {
    throw new Error(`خطأ في إضافة فرد جديد: ${error.message}`);
  }
}

// تحديث معلومات فرد في العائلة
async function updateFamilyMember(memberId, updateData) {
  try {
    const member = await FamilyMember.findById(memberId);
    if (!member) {
      throw new Error('لم يتم العثور على العضو');
    }

    // تحديث المعلومات الأساسية
    const allowedUpdates = [
      'firstName', 'middleName', 'lastName', 'university',
      'profession', 'address', 'contactInfo'
    ];

    allowedUpdates.forEach(field => {
      if (updateData[field]) {
        member[field] = updateData[field];
      }
    });

    await member.save();
    return member;
  } catch (error) {
    throw new Error(`خطأ في تحديث معلومات العضو: ${error.message}`);
  }
}

// تسجيل وفاة
async function registerDeath(memberId, deathDate) {
  try {
    const member = await FamilyMember.findById(memberId);
    if (!member) {
      throw new Error('لم يتم العثور على العضو');
    }

    member.isDeceased = true;
    member.deathDate = deathDate || new Date();

    // تحديث حالة الزواج الحالي
    member.spouses.forEach(spouse => {
      if (spouse.isCurrent) {
        spouse.isCurrent = false;
      }
    });

    await member.save();
    return member;
  } catch (error) {
    throw new Error(`خطأ في تسجيل الوفاة: ${error.message}`);
  }
}

// البحث عن أفراد العائلة
async function searchFamilyMembers(query) {
  try {
    const searchCriteria = {};

    if (query.lastName) {
      searchCriteria.lastName = new RegExp(query.lastName, 'i');
    }
    if (query.firstName) {
      searchCriteria.firstName = new RegExp(query.firstName, 'i');
    }
// تكملة الكونترولر (controllers/familyMemberController.js)

if (query.gender) {
    searchCriteria.gender = query.gender;
  }

  const members = await FamilyMember.find(searchCriteria)
    .populate('parents')
    .populate('spouses.person')
    .populate('children.child');

  return members;
} catch (error) {
  throw new Error(`خطأ في البحث: ${error.message}`);
}
}

// الحصول على شجرة العائلة
async function getFamilyTree(memberId) {
try {
  const member = await FamilyMember.findById(memberId)
    .populate('parents')
    .populate('spouses.person')
    .populate({
      path: 'children.child',
      populate: {
        path: 'children.child'
      }
    })
    .populate('children.otherParent');

  if (!member) {
    throw new Error('لم يتم العثور على العضو');
  }

  return member;
} catch (error) {
  throw new Error(`خطأ في استرجاع شجرة العائلة: ${error.message}`);
}
}

// الحصول على الأخوة والأخوات
async function getSiblings(memberId) {
try {
  const member = await FamilyMember.findById(memberId).populate('parents');
  if (!member || !member.parents.length) {
    return [];
  }

  const siblings = await FamilyMember.find({
    parents: { $in: member.parents },
    _id: { $ne: memberId }
  });

  return siblings;
} catch (error) {
  throw new Error(`خطأ في استرجاع الأخوة والأخوات: ${error.message}`);
}
}

// تسجيل زواج جديد
async function registerMarriage(memberId, spouseData) {
try {
  const member = await FamilyMember.findById(memberId);
  if (!member) {
    throw new Error('لم يتم العثور على العضو');
  }

  // التحقق من عدم وجود زواج حالي
  const hasCurrentSpouse = member.spouses.some(s => s.isCurrent);
  if (hasCurrentSpouse) {
    throw new Error('العضو متزوج حالياً');
  }

  // إنشاء الزوج/ة الجديد/ة إذا لم يكن موجوداً
  let spouse;
  if (spouseData._id) {
    spouse = await FamilyMember.findById(spouseData._id);
    if (!spouse) {
      throw new Error('لم يتم العثور على الزوج/ة');
    }
  } else {
    spouse = await createFamilyMember(spouseData);
  }

  const marriageDate = spouseData.marriageDate || new Date();

  // إضافة العلاقة للطرفين
  member.spouses.push({
    person: spouse._id,
    marriageDate,
    isCurrent: true
  });

  spouse.spouses.push({
    person: member._id,
    marriageDate,
    isCurrent: true
  });

  await member.save();
  await spouse.save();

  return { member, spouse };
} catch (error) {
  throw new Error(`خطأ في تسجيل الزواج: ${error.message}`);
}
}

// تسجيل طلاق
async function registerDivorce(memberId, spouseId, divorceDate) {
try {
  const member = await FamilyMember.findById(memberId);
  const spouse = await FamilyMember.findById(spouseId);

  if (!member || !spouse) {
    throw new Error('لم يتم العثور على أحد الزوجين أو كليهما');
  }

  // تحديث حالة الزواج للطرفين
  const memberSpouse = member.spouses.find(s => s.person.toString() === spouseId && s.isCurrent);
  const spousePartner = spouse.spouses.find(s => s.person.toString() === memberId && s.isCurrent);

  if (!memberSpouse || !spousePartner) {
    throw new Error('لا يوجد زواج حالي بين الطرفين');
  }

  memberSpouse.isCurrent = false;
  memberSpouse.divorceDate = divorceDate || new Date();

  spousePartner.isCurrent = false;
  spousePartner.divorceDate = divorceDate || new Date();

  await member.save();
  await spouse.save();

  return { member, spouse };
} catch (error) {
  throw new Error(`خطأ في تسجيل الطلاق: ${error.message}`);
}
}

// إضافة طفل
async function addChild(parentIds, childData) {
try {
  // التحقق من وجود الوالدين
  const parents = await FamilyMember.find({ _id: { $in: parentIds } });
  if (parents.length !== 2) {
    throw new Error('يجب تحديد الوالدين بشكل صحيح');
  }

  // إنشاء الطفل
  const child = await createFamilyMember({
    ...childData,
    parents: parentIds
  });

  // تحديث سجلات الوالدين
  for (const parent of parents) {
    const otherParentId = parentIds.find(id => id.toString() !== parent._id.toString());
    parent.children.push({
      child: child._id,
      otherParent: otherParentId
    });
    await parent.save();
  }

  return child;
} catch (error) {
  throw new Error(`خطأ في إضافة طفل: ${error.message}`);
}
}

// حذف فرد من العائلة (مع الحفاظ على السجلات التاريخية)
async function deleteFamilyMember(memberId) {
try {
  const member = await FamilyMember.findById(memberId);
  if (!member) {
    throw new Error('لم يتم العثور على العضو');
  }

  // يمكن إضافة منطق إضافي هنا للتعامل مع العلاقات
  // مثل تحديث سجلات الوالدين والأزواج والأطفال

  await member.remove();
  return { message: 'تم حذف العضو بنجاح' };
} catch (error) {
  throw new Error(`خطأ في حذف العضو: ${error.message}`);
}
}

module.exports = {
createFamilyMember,
addFamilyMember,
updateFamilyMember,
registerDeath,
searchFamilyMembers,
getFamilyTree,
getSiblings,
registerMarriage,
registerDivorce,
addChild,
deleteFamilyMember
};