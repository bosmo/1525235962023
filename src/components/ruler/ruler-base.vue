<template>
  <canvas height="15" width="1544"></canvas>
</template>
<script>
  export default {
    name: 'UiRuler',
    props: {
      zoom: Number,
      width: Number,
      height: Number
    },
    methods: {
      update () {
        zoom = this.zoom
        if (!zoom) { zoom = svgCanvas.getZoom(); }
        if (!scanvas) { scanvas = $('#svgcanvas'); }

        var d, i;
        var limit = 30000;
        var contentElem = svgCanvas.getContentElem();
        var units = svgedit.units.getTypeMap();
        var unit = units[curConfig.baseUnit]; // 1 = 1px

        // draw x ruler then y ruler
        for (d = 0; d < 2; d++) {
          var isX = (d === 0);
          var dim = isX ? 'x' : 'y';
          var lentype = isX ? 'width' : 'height';
          var contentDim = Number(contentElem.getAttribute(dim));

          var $hcanvOrig = $('#ruler_' + dim + ' canvas:first');

          // Bit of a hack to fully clear the canvas in Safari & IE9
          var $hcanv = $hcanvOrig.clone();
          $hcanvOrig.replaceWith($hcanv);

          var hcanv = $hcanv[0];

          // Set the canvas size to the width of the container
          var rulerLen = scanvas[lentype]();
          var totalLen = rulerLen;
          hcanv.parentNode.style[lentype] = totalLen + 'px';
          var ctxNum = 0;
          var ctx = hcanv.getContext('2d');
          var ctxArr, num, ctxArrNum;

          ctx.fillStyle = 'rgb(200,0,0)';
          ctx.fillRect(0, 0, hcanv.width, hcanv.height);

          // Remove any existing canvasses
          $hcanv.siblings().remove();

          // Create multiple canvases when necessary (due to browser limits)
          if (rulerLen >= limit) {
            ctxArrNum = parseInt(rulerLen / limit, 10) + 1;
            ctxArr = [];
            ctxArr[0] = ctx;
            var copy;
            for (i = 1; i < ctxArrNum; i++) {
              hcanv[lentype] = limit;
              copy = hcanv.cloneNode(true);
              hcanv.parentNode.appendChild(copy);
              ctxArr[i] = copy.getContext('2d');
            }

            copy[lentype] = rulerLen % limit;

            // set copy width to last
            rulerLen = limit;
          }

          hcanv[lentype] = rulerLen;

          var uMulti = unit * zoom;

          // Calculate the main number interval
          var rawM = 50 / uMulti;
          var multi = 1;
          for (i = 0; i < rIntervals.length; i++) {
            num = rIntervals[i];
            multi = num;
            if (rawM <= num) {
              break;
            }
          }

          var bigInt = multi * uMulti;

          ctx.font = '9px sans-serif';

          var rulerD = ((contentDim / uMulti) % multi) * uMulti;
          var labelPos = rulerD - bigInt;
          // draw big intervals
          while (rulerD < totalLen) {
            labelPos += bigInt;
            // var real_d = rulerD - contentDim; // Currently unused

            var curD = Math.round(rulerD) + 0.5;
            if (isX) {
              ctx.moveTo(curD, 15);
              ctx.lineTo(curD, 0);
            } else {
              ctx.moveTo(15, curD);
              ctx.lineTo(0, curD);
            }

            num = (labelPos - contentDim) / uMulti;
            var label;
            if (multi >= 1) {
              label = Math.round(num);
            } else {
              var decs = String(multi).split('.')[1].length;
              label = num.toFixed(decs);
            }

            // Change 1000s to Ks
            if (label !== 0 && label !== 1000 && label % 1000 === 0) {
              label = (label / 1000) + 'K';
            }

            if (isX) {
              ctx.fillText(label, rulerD + 2, 8);
            } else {
              // draw label vertically
              var str = String(label).split('');
              for (i = 0; i < str.length; i++) {
                ctx.fillText(str[i], 1, (rulerD + 9) + i * 9);
              }
            }

            var part = bigInt / 10;
            // draw the small intervals
            for (i = 1; i < 10; i++) {
              var subD = Math.round(rulerD + part * i) + 0.5;
              if (ctxArr && subD > rulerLen) {
                ctxNum++;
                ctx.stroke();
                if (ctxNum >= ctxArrNum) {
                  i = 10;
                  rulerD = totalLen;
                  continue;
                }
                ctx = ctxArr[ctxNum];
                rulerD -= limit;
                subD = Math.round(rulerD + part * i) + 0.5;
              }

              // odd lines are slighly longer
              var lineNum = (i % 2) ? 12 : 10;
              if (isX) {
                ctx.moveTo(subD, 15);
                ctx.lineTo(subD, lineNum);
              } else {
                ctx.moveTo(15, subD);
                ctx.lineTo(lineNum, subD);
              }
            }
            rulerD += bigInt;
          }
          ctx.strokeStyle = '#000';
          ctx.stroke();
        }
      }
    }
  }
</script>
