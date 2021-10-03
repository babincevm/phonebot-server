const wrapInApplicationJson = (schema) => ({
  content: {
    'application/json': {
      schema: {
        ...schema,
      },
    },
  },
});

const wrapIn200 = (description, schema) => ({
  '200': {
    description: description,
    ...wrapInApplicationJson(schema),
  },
});

const wrapInParameters = (parameters) => ({
  parameters: parameters.reduce((acc, param) => {
    acc.push({
      in: param.in ?? 'path',
      name: param.name ?? 'id',
      required: param.required ?? true,
      description: param.description,
    });
    return acc;
  }, []),
});

module.exports = {
  wrapIn200,
  wrapInApplicationJson,
  wrapInParameters
};
