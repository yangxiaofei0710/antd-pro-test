import moment from 'moment';

const dateFormat = 'YYYY-MM-DD';
export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - (day * oneDay);

    return [moment(beginTime), moment(beginTime + ((7 * oneDay) - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`), moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000)];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach((node) => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * (10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整');
}
/**
 * 对象的每一个key进行函数包装处理
 * params: [obj] 要包装的对象， [func] 包装函数
 * 注意： 只支持一层的对象，不允许对象嵌套
 */
export function objKeyWrapper(obj, func) {
  const keys = Object.keys(obj);
  const newObj = {};
  keys.forEach((key, index) => {
    newObj[key] = func(obj[key]);
  });
  return newObj;
}

// 这里处理form中存在DatePicker组件赋值
export function fromFilesWrapper(obj, func) {
  const keys = Object.keys(obj);
  const newObj = {};
  keys.forEach((key, index) => {
    if (key.substr(-4) == 'time' && obj[`${key}`].value !== undefined) {
      newObj[key] = func({
        ...obj,
        value: moment(obj[`${key}`].value, dateFormat),
      });
    } else {
      newObj[key] = func(obj[key]);
    }
  });
  return newObj;
}

// 树的遍历, func 为处理函数，func接收一个参数：nodeItem
export function treeTravel(treeData, func) {
  treeData.forEach((nodeItem) => {
    func(nodeItem);
    if (nodeItem.children) {
      treeTravel(nodeItem.children, func);
    }
  });
}

// 项目列表新增数据整合
export function newSubArr(arr) {
  const newArr = [];
  for (let i = 0; i < arr.length; i++) {
    newArr.push(arr[i].split('-')[1]);
  }
  return newArr.join(',');
}
// 获取对象value
export function getObjKey(obj) {
  const notFilled = [];
  Object.keys(obj).forEach((item, index) => {
    if (obj[item].value === undefined || obj[item].value === '') {
      notFilled.push(item);
    }
  });
  return notFilled;
}

// 删除数组中指定元素
export function deleteArrItem(arr, item) {
  const newArr = arr;
  const index = arr.indexOf(item);
  if (index > -1) {
    newArr.splice(index, 1);
  }
  return newArr;
}

// 提交表单时，时间选择框有默认值且不能更改时，点击确认提交表单格式化时间控件的值
export function formatDateTime(data, typeArr) {
  const newData = data;
  typeArr.forEach((item) => {
    if (data.hasOwnProperty(item)) {
      newData[`${item}`] = {
        value: data[`${item}`].value.format('YYYY-MM-DD'),
      };
    }
  });
  return newData;
}

// 校验ip地址
export function checkedIP(rule, value, callback) {
  const regName = /^((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))$/g.test(value);
  if (!regName) {
    callback('请输入正确IP地址');
  }
  callback();
}

// 允许输入多条IP，多条ip中间用空格隔开
export function checkedSwitchIP(rule, value, callback) {
  const regName = /^(((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\s*)+$/g.test(value);
  if (!regName) {
    callback('请输入正确IP地址');
  }
  callback();
}
// 遍历子节点，添加父级节点信息
export function getParentInfo(tree, checkNodeIds) {
  // console.log('tree', tree);
  const treeData = tree;
  tree.forEach((item) => {
    if (!item.children) {
      item.checked = checkNodeIds.indexOf(item.id) > -1;
    }
    if (item.children) {
      item.children.forEach((child) => {
        child.parentId = item.id;
        child.parentName = item.name;
        child.fullId = `${item.id}/${child.id}`;
        child.fullName = `${item.name}/${child.name}`;
        child.id = `${item.id}-${child.id}`;
      });
      getParentInfo(item.children, checkNodeIds);
    }
  });
  return treeData;
}
// 根据已选择id， 遍历树型结构中已选择的树节点
export function treeFilter(keys, treeData, treeSelect) {
  const parentKey = treeSelect;
  for (let i = 0; i < treeData.length; i++) {
    const node = treeData[i];
    if (node.children) {
      if (node.children.some(item => keys.indexOf(item.id) > -1)) {
        parentKey.push(node);
      }
      treeFilter(keys, node.children, parentKey);
    }
  }
  parentKey.forEach((item, index) => {
    item.children = item.children.filter((data) => { return data.checked; });
  });
  return parentKey;
}

// 根据老数组，对新数组进行排序
export function sortArray(newArr, oldArr) {
  // console.log('new', newArr, 'old', oldArr);
  oldArr.forEach((oldItem, oldIndex) => {
    newArr.forEach((newItem, newIndex) => {
      if (oldItem.id == newItem.id) {
        if (newArr[newIndex].children) {
          sortArray(newArr[newIndex].children, oldArr[oldIndex].children);
        }
        const arr = newArr[newIndex];
        newArr.splice(newIndex, 1);
        newArr.splice(oldIndex, 0, arr);
      }
    });
  });
  // console.log('new111', newArr, 'old111', oldArr);
}
