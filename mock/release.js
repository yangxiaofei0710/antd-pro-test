export const projectList = {
  code: 200,
  msg: 'mock',
  data: {
    msgdata: {
      public: [
        {
          id: '1',
          name: '公共服务',
          module_tech: 'mock',
          children: [
            {
              id: '1-1',
              name: '1-1',
              updatetime: 'mock',
              children: [
                {
                  id: '1-1-1',
                  name: '1-1-1',
                  checked: false,
                },
              ],
            },
          ],
        },
      ],
      private: [
        {
          id: '2',
          name: '服务1',
          module_tech: 'mock',
          children: [
            {
              id: '1',
              name: '2-1',
              updatetime: 'mock',
              children: [
                {
                  id: '1',
                  name: '2-1-1',
                  checked: false,
                },
              ],
            }, {
              id: '2',
              name: '2-2',
              updatetime: 'mock',
              children: [
                {
                  id: '1',
                  name: '2-2-1',
                  checked: false,
                }, {
                  id: '2',
                  name: '2-2-2',
                  checked: false,
                }, {
                  id: '3',
                  name: '2-2-3',
                  checked: false,
                },
              ],
            }, {
              id: '3',
              name: '2-3',
              updatetime: 'mock',
              children: [
                {
                  id: '1',
                  name: '2-3-1',
                  checked: false,
                },
              ],
            },
          ],
        }, {
          id: '3',
          name: '服务2',
          module_tech: 'mock',
          children: [
            {
              id: '1',
              name: '3-1',
              updatetime: 'mock',
              children: [
                {
                  id: '1',
                  name: '3-1-1',
                  checked: false,
                },
              ],
            }, {
              id: '2',
              name: '3-2',
              updatetime: 'mock',
              children: [
                {
                  id: '1',
                  name: 'mock',
                  checked: false,
                },
              ],
            }, {
              id: '3',
              name: '3-3',
              updatetime: 'mock',
              children: [
                {
                  id: '1',
                  name: '3-3-1',
                  checked: false,
                },
              ],
            },
          ],
        },
      ],
    },
    checkNodeIds: [],
  },
};

export const projectTreeRelease = {
  code: 200,
  msg: 'success',
  data: [
    {
      id: '1-1',
      name: 'project-1',
    }, {
      id: '1-2',
      name: 'project-2',
    }, {
      id: '1-3',
      name: 'project-3',
    }, {
      id: '1-4',
      name: 'project-4',
    },
  ],
};
export default {
  projectList,
  projectTreeRelease,
};
