const getTypeValue = (value, itemType, defaultValue) => {
  if (itemType === "boolean") {
    return value === null || value === undefined
      ? defaultValue
      : Boolean(value);
  }
  if (itemType === "date") {
    return value instanceof Date ? value.toISOString() : defaultValue;
  }
  if (["float", "int", "number"].includes(itemType)) {
    if (isNaN(value) || value === null || value === undefined) {
      return defaultValue;
    }
    return parseFloat(value);
  }
  return value === undefined || value === null
    ? defaultValue
    : value?.toString();
};

const processObject = (obj, schema, item) => {
  const subResult = {};
  for (const subItem in schema[item].properties) {
    const subProperty = schema[item].properties[subItem];
    const subItemType = subProperty.type;
    const defaultValue = subProperty.default;
    subResult[subItem] = getTypeValue(
      obj[item]?.[subItem],
      subItemType,
      defaultValue,
    );
  }
  return Object.keys(subResult).length > 0 ? subResult : undefined;
};

const processArray = (obj, schema, item) => {
  const { items } = schema[item];
  if (items.type === "object") {
    const processedElements = obj[item]
      ?.filter((element) => typeof element === "object")
      .map((element) => processItem(element, items.properties));
    return processedElements.length > 0 ? processedElements : undefined;
  }
  if (items.type === "any") {
    return JSON.parse(JSON.stringify(obj[item]));
  }
  if (
    ["string", "number", "boolean", "date", "float", "int"].includes(items.type)
  ) {
    const processedElements = obj[item]
      ?.filter((element) => typeof element === items.type)
      .map((element) => getTypeValue(element, items.type));
    return processedElements?.length > 0 ? processedElements : undefined;
  }
};

const processItem = (obj, schema, item, type) => {
  if (["string", "number", "boolean", "date", "float", "int"].includes(type)) {
    const defaultValue = schema[item]?.default;
    return getTypeValue(obj[item], type, defaultValue);
  }
  if (type === "object") {
    return processObject(obj, schema, item);
  }
  if (type === "array") {
    return processArray(obj, schema, item);
  }
  return obj[item]; // Handle other types as-is
};

exports.getObjectBySchema = (obj, schema) => {
  const result = {};

  for (const item in schema) {
    const processedValue = processItem(obj, schema, item, schema[item].type);

    if (
      processedValue !== undefined &&
      processedValue !== null &&
      processedValue !== ""
    ) {
      result[item] = processedValue;
    }
  }

  // Remove undefined values from the result
  for (const key in result) {
    if (
      result[key] === undefined ||
      isNaN(result[key]) ||
      result[key] === null
    ) {
      delete result[key];
    }
  }

  return result;
};
