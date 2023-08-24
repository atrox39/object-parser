const getObjectBySchema = (obj, schema) => {
  const processItem = (item, type) => {
    if (
      type === 'string' ||
      type === 'number' ||
      type === 'boolean' ||
      type === 'date' ||
      type === 'float' ||
      type === 'int'
    ) {
      if (type === 'date') {
        return obj[item]?.toISOString();
      }
      if (type === 'float' || type === 'int') {
        return parseFloat(obj[item]);
      }
      return obj[item]?.toString();
    }
    if (type === 'object') {
      const subResult = {};
      Object.keys(schema[item].properties).forEach((subItem) => {
        const subItemType = schema[item].properties[subItem].type;
        if (
          subItemType === 'string' ||
          subItemType === 'number' ||
          subItemType === 'boolean' ||
          subItemType === 'date' ||
          subItemType === 'float' ||
          subItemType === 'int'
        ) {
          if (subItemType === 'date') {
            subResult[subItem] = obj[item]?.[subItem]?.toISOString();
          } else if (subItemType === 'float' || subItemType === 'int') {
            subResult[subItem] = parseFloat(obj[item]?.[subItem]);
          } else {
            subResult[subItem] = obj[item]?.[subItem]?.toString();
          }
        }
      });
      return Object.keys(subResult).length > 0 ? subResult : undefined;
    }
    if (type === 'array') {
      const { items } = schema[item];
      if (items.type === 'object') {
        const processedElements = obj[item]
          ?.filter((element) => typeof element === 'object')
          .map((element) => getObjectBySchema(element, items.properties));
        return processedElements.length > 0 ? processedElements : undefined;
      }
      if (items.type === 'any') {
        return JSON.parse(JSON.stringify(obj[item]));
      }
      if (
        items.type === 'string' ||
        items.type === 'number' ||
        items.type === 'boolean' ||
        items.type === 'date' ||
        items.type === 'float' ||
        items.type === 'int'
      ) {
        const processedElements = obj[item]
          // eslint-disable-next-line valid-typeof
          ?.filter((element) => typeof element === items.type)
          .map((element) => {
            if (items.type === 'date') {
              return element?.toISOString();
            }
            if (items.type === 'float' || items.type === 'int') {
              return parseFloat(element);
            }
            return element?.toString();
          });
        return processedElements.length > 0 ? processedElements : undefined;
      }
    }
    return obj[item]; // Handle other types as-is
  };

  const result = {};

  Object.keys(schema).forEach((item) => {
    const processedValue = processItem(item, schema[item].type);

    if (processedValue !== undefined && processedValue !== null && processedValue !== '') {
      result[item] = processedValue;
    }
  });

  return result;
};

exports.getObjectBySchema = getObjectBySchema;
