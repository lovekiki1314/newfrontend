<template>
  <div id="container1"></div>
</template>

<script>
export default {
  mounted () {
    // this.paint()
  },
  methods: {
    paint () {
      const width = 800
      const height = 500
      const colors = [
        '#BDD2FD',
        '#BDEFDB',
        '#C2C8D5',
        '#FBE5A2',
        '#F6C3B7',
        '#B6E3F5',
        '#D3C6EA',
        '#FFD8B8',
        '#AAD8D8',
        '#FFD6E7',
      ];
      const strokes = [
        '#5B8FF9',
        '#5AD8A6',
        '#5D7092',
        '#F6BD16',
        '#E8684A',
        '#6DC8EC',
        '#9270CA',
        '#FF9D4D',
        '#269A99',
        '#FF99C3',
			];
			
			const main = async() =>{
				const response = await fetch('http://localhost:8080/graduate_project/G6/json/test1.json')
				const data = await response.json
			}

      const graph = new this.$g6.Graph({
        container: 'container1',
        width,
        height,
        modes: {
          default: ['drag-canvas', 'drag-node', 'zoom-canvas', 'activate-relations'],
        },
        layout: {
          // type: 'fruchterman',
          // maxIteration: 1000
          type: 'force',
          preventOverlap: true,
          nodeSize: 15,
          workerEnabled: true
        },
        animate: true,
        defaultNode: {
          size: 10,
          style: {
            lineWidth: 2,
            // stroke: '#5B8FF9',
            // fill: '#C6E5FF',
          },
        },
        defaultEdge: {
          size: 1,
          color: '#666',
          style: {
            opacity: 0.2,
          },
        },
        nodeStateStyles: {
          active: {
            stroke: '#5B8FF9',
            fill: '#C6E5FF',
            opacity: 1,
          },
          inactive: {
            opacity: 0.1,
          },
        },
        edgeStateStyles: {
          active: {
            stroke: '#000',
            opacity: 0.7
          },
        }
      });


      function handleNodeClick (event) {
        const item = event.item;
        // 聚焦当前点击的节点（把节点放到视口中心）
        const matrix = item.get('group').getMatrix();
        const point = {
          x: matrix[6],
          y: matrix[7],
        };
        console.log(point)
        const w = graph.get('width');
        const h = graph.get('height');
        // 找到视口中心
        const viewCenter = {
          x: w / 2,
          y: h / 2,
        };
        const modelCenter = graph.getPointByCanvas(viewCenter.x, viewCenter.y);
        let viewportMatrix = graph.get('group').getMatrix();
        if (!viewportMatrix) viewportMatrix = this.$g6.Util.mat3.create();
        // 画布平移的目标位置，最终目标是graph.translate(dx, dy);
        const dx = (modelCenter.x - point.x) * viewportMatrix[0];
        const dy = (modelCenter.y - point.y) * viewportMatrix[4];
        let lastX = 0;
        let lastY = 0;
        let newX = void 0;
        let newY = void 0;
        // 动画每次平移一点，直到目标位置
        console.log(dx)
        console.log(dy)
        graph.get('canvas').animate(
          ratio => {
            newX = dx * ratio;
            newY = dy * ratio;
            graph.translate(newX - lastX, newY - lastY);
            lastX = newX;
            lastY = newY;
          }, {
          duration: 300,
          easing: 'easeCubic',
        },
        );
      }

      // 监听节点上的click事件
      graph.on('node:click', handleNodeClick);

      fetch('/new1.json')
        .then(res => res.json())
        .then(data => {
          const nodes = data.nodes;
          const sonCountMap = new Map();
          let sonCountId = 0;
          nodes.forEach(function (node) {
            // sonCount
            if (node.sonCount && sonCountMap.get(node.sonCount) === undefined) {
              sonCountMap.set(node.sonCount, sonCountId);
              sonCountId++;
            }
            const cid = sonCountMap.get(node.sonCount);
            if (!node.style) {
              node.style = {};
            }
            node.style.fill = colors[cid % colors.length];
            node.style.stroke = strokes[cid % strokes.length];
          });

          // const edges = data.edges;
          // const sourceMap = new Map()
          // let sourceId = 0;
          // edges.forEach(function (edge) {
          //   if (edge.source && sourceMap.get(edge.source) === undefined) {
          //     sourceMap.set(edge.source, sourceId);
          //     sourceId++;
          //   }
          //   const id = sourceMap.get(edge.source);
          //   var node = edge.getTarget()
          //   if (!node.style) {
          //     node.style = {};
          //   }
          //   node.style.fill = colors[id % colors.length];
          //   node.style.stroke = strokes[id % strokes.length];
          // })
          graph.data(data);
          graph.render();
        });
    }
  }
}
</script>

<style>
</style>