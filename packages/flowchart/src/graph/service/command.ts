import { createCmdConfig, DisposableCollection, uuidv4 } from '@antv/xflow';
import { getProps } from '../../util';

export const useCmdConfig = createCmdConfig((config, proxy) => {
  const { flowchartId } = proxy.getValue();
  // 设置hook
  config.setRegisterHookFn((hooks) => {
    const list = [
      hooks.addNode.registerHook({
        name: 'get node config from backend api',
        handler: async (args) => {
          args.nodeConfig = {
            ...args.nodeConfig,
            id: args.nodeConfig.id || `node-${uuidv4()}`,
            zIndex: args.nodeConfig.zIndex || 10,
            /** 移除 _copied */
            label: args.nodeConfig.label?.replace?.(/\_copied/g, ''),
          };
          const onAddNode = getProps(flowchartId, 'onAddNode');
          if (typeof onAddNode === 'function') {
            onAddNode(args.nodeConfig);
          }
        },
      }),
    ];
    const toDispose = new DisposableCollection();
    toDispose.pushAll(list);
    return toDispose;
  });
});
