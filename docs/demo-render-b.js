              renderMetric("待审核楼栋", state.buildings.filter(function (item) { return item.reviewStatus === "待审核" || item.reviewStatus === "待预审"; }).length, "优先处理对象") +
              renderMetric("房间待补充", allSuites().filter(function (row) { return row.suite.auditStatus === "待补充"; }).length, "需要回退中介补资料") +
            "</div>" +
            '<div class="layout detail">' +
              '<div class="stack">' +
                '<div class="panel" style="padding:22px"><div class="section-title"><div><h2>楼栋审核主表</h2><div class="small" style="margin-top:6px">审核顺序：先看楼栋，再进详情看房间</div></div>' + chip("点击详情进入") + '</div>' +
                  renderAdminBuildingTable() +
                "</div>" +
                (building ? renderAdminBuildingDetail(building) : "") +
                (building ? renderAdminSuiteTable(building) : "") +
              "</div>" +
              '<div class="stack">' +
                (suite ? renderAdminSuiteDetail(building, suite) : '<div class="panel" style="padding:22px"><div class="empty">请选择房间查看详情。</div></div>') +
                '<div class="panel" style="padding:22px"><h2>审核规则提醒</h2><div class="note" style="margin-top:14px">中介端不做地址最终合规判断。后台重点确认楼栋是否值得进入推荐池，再处理房间是否可展示给租客。电费账单允许“电力公司直开独立账单”或“主账单 + Suite 子账单”两类方案。</div></div>' +
              "</div>" +
            "</div>" +
          "</div>";
      }

      function renderAdminBuildingTable() {
        return '<div class="table-card" style="margin-top:16px"><table class="table"><thead><tr><th>楼栋</th><th>地址</th><th>维护中介</th><th>房间</th><th>审核状态</th><th>操作</th></tr></thead><tbody>' +
          state.buildings.map(function (item) {
            const pendingCount = item.suites.filter(function (suite) { return suite.auditStatus === "待审核" || suite.auditStatus === "待补充"; }).length;
            return '<tr>' +
              "<td><strong>" + escapeHtml(item.name) + "</strong><div class=\"small\" style=\"margin-top:4px\">" + escapeHtml(item.city) + "</div></td>" +
              "<td>" + escapeHtml(item.rawAddress) + '<div class="small" style="margin-top:4px">' + escapeHtml(electricBillLabel(item.electricBillMode)) + "</div></td>" +
              "<td>" + escapeHtml(item.maintainerName) + "</td>" +
              "<td>总数：" + item.suites.length + '<br /><span class="small">待处理：' + pendingCount + "</span></td>" +
              "<td>" + chip(item.reviewStatus) + "</td>" +
              '<td><button class="btn subtle" data-action="admin-select-building" data-building-id="' + item.id + '">详情</button></td>' +
            "</tr>";
          }).join("") +
          "</tbody></table></div>";
      }

      function renderAdminBuildingDetail(building) {
        return '<div class="panel" style="padding:22px">' +
          '<div class="section-title"><div><h2>楼栋详情</h2><div class="small" style="margin-top:6px">楼栋审核状态、账单能力、付款流程都在这里确认</div></div>' + chip(building.reviewStatus) + "</div>" +
          '<div class="field-grid" style="margin-top:16px">' +
            renderInfoTile("楼栋名称", building.name) +
            renderInfoTile("地址", building.rawAddress) +
            renderInfoTile("电费账单提供能力", electricBillLabel(building.electricBillMode)) +
            renderInfoTile("宽带账单提供能力", broadbandLabel(building.broadbandBillStatus)) +
            renderInfoTile("租金包含项", building.rentIncludes.length ? building.rentIncludes.join(" / ") : "未填写") +
            renderInfoTile("维护中介", building.maintainerName + " / " + building.maintainerId) +
          "</div>" +
          '<div class="record" style="margin-top:14px"><div class="small">付款流程说明</div><strong>' + escapeHtml(building.paymentFlowNote || paymentFlowHint()) + "</strong></div>" +
          '<div class="field-grid" style="margin-top:14px">' +
            '<div>' + renderSelect("admin-building", "buildingReviewDraft", "楼栋审核状态", REVIEW_OPTIONS, ui.admin.buildingReviewDraft || building.reviewStatus) + "</div>" +
            '<div style="display:flex;align-items:flex-end"><button class="btn admin" data-action="admin-save-building-review">保存楼栋审核状态</button></div>' +
          "</div>" +
          '<div class="field-grid" style="margin-top:14px">' +
            '<div class="record"><strong>楼栋外围照片</strong>' + photoGrid(building.exteriorPhotos) + "</div>" +
            '<div class="record"><strong>楼栋门牌照片</strong>' + photoGrid(building.doorplatePhotos) + "</div>" +
          "</div>" +
        "</div>";
      }

      function renderAdminSuiteTable(building) {
        const allChecked = building.suites.length > 0 && ui.admin.checkedSuiteIds.length === building.suites.length;
        return '<div class="panel" style="padding:22px">' +
          '<div class="section-title"><div><h2>房间信息主表</h2><div class="small" style="margin-top:6px">先看主要信息，点击详情可进入单个房间审核</div></div>' +
          '<div class="actions"><button class="btn subtle" data-action="admin-toggle-all-suites">' + (allChecked ? "取消全选" : "全选当前楼栋房间") + '</button>' + chip("已选 " + ui.admin.checkedSuiteIds.length + " 个") + "</div></div>" +
          '<div class="table-card" style="margin-top:16px"><table class="table"><thead><tr><th>选择</th><th>Suite</th><th>面积</th><th>月租</th><th>可租状态</th><th>资料状态</th><th>租客端状态</th><th>操作</th></tr></thead><tbody>' +
            building.suites.map(function (suite) {
              return '<tr>' +
                '<td><input type="checkbox" data-action="admin-toggle-suite-check" data-suite-id="' + suite.id + '"' + (ui.admin.checkedSuiteIds.includes(suite.id) ? " checked" : "") + " /></td>" +
                "<td><strong>" + escapeHtml(suite.suite) + '</strong><div class="small" style="margin-top:4px">' + escapeHtml(suite.remark || "未补充备注") + "</div></td>" +
                "<td>" + suite.area + " SF</td>" +
                "<td>" + formatMoney(suite.rent) + "</td>" +
                "<td>" + chip(suite.status) + "</td>" +
                "<td>" + chip(suite.auditStatus) + "</td>" +
                "<td>" + chip(suite.tenantDisplay) + "</td>" +
                '<td><button class="btn subtle" data-action="admin-select-suite" data-suite-id="' + suite.id + '">详情</button></td>' +
              "</tr>";
            }).join("") +
          "</tbody></table></div>" +
          '<div class="actions" style="margin-top:16px"><button class="btn admin" data-action="admin-batch" data-mode="approve">批量通过</button><button class="btn subtle" data-action="admin-batch" data-mode="return">批量退回补充</button><button class="btn subtle" data-action="admin-batch" data-mode="pause">批量暂停推荐</button><button class="btn subtle" data-action="admin-batch" data-mode="rented">批量标记已出租</button></div>' +
        "</div>";
      }

      function renderAdminSuiteDetail(building, suite) {
        return '<div class="panel" style="padding:22px">' +
          '<div class="section-title"><div><div class="eyebrow" style="color:var(--admin)">房间详情</div><h2 style="margin-top:8px">' + escapeHtml(building.name) + " / " + escapeHtml(suite.suite) + '</h2></div>' + chip(suite.auditStatus) + "</div>" +
          '<div class="field-grid" style="margin-top:16px">' +
            renderInfoTile("月租", formatMoney(suite.rent)) +
            renderInfoTile("面积", suite.area + " SF") +
            renderInfoTile("租金包含项", building.rentIncludes.length ? building.rentIncludes.join(" / ") : "未填写") +
            renderInfoTile("家具情况", building.furniture || "未填写") +
          "</div>" +
          '<div class="field-grid" style="margin-top:14px">' +
            renderSelect("admin-suite", "suiteAuditDraft", "房间审核状态", SUITE_AUDIT_OPTIONS, ui.admin.suiteAuditDraft || suite.auditStatus) +
            renderSelect("admin-suite", "suiteStatusDraft", "当前可租状态", SUITE_STATUS_OPTIONS, ui.admin.suiteStatusDraft || suite.status) +
            renderSelect("admin-suite", "suiteDisplayDraft", "租客端展示状态", SUITE_DISPLAY_OPTIONS, ui.admin.suiteDisplayDraft || suite.tenantDisplay) +
            '<label class="field"><span class="small">备注</span><textarea class="textarea" data-bind="admin-suite" data-key="suiteRemarkDraft">' +
            escapeHtml(ui.admin.suiteRemarkDraft || suite.remark || BLANK) +
            "</textarea></label>" +
          "</div>" +
          '<div class="actions" style="margin-top:14px"><button class="btn admin" data-action="admin-save-suite">保存房间详情</button></div>' +
          '<div class="field-grid" style="margin-top:14px">' +
            '<div class="record"><strong>房间内部照片</strong>' + photoGrid(suite.insidePhotos) + "</div>" +
            '<div class="record"><strong>房门 / 门牌照片</strong>' + photoGrid(suite.doorPhotos) + "</div>" +
          "</div>" +
        "</div>";
      }

      function renderMetric(label, value, hint) {
        return '<div class="metric"><div class="small">' + escapeHtml(label) + '</div><div class="num">' + escapeHtml(String(value)) + '</div><div class="muted" style="margin-top:8px">' + escapeHtml(hint) + "</div></div>";
      }

      function renderInfoTile(label, content) {
        return '<div class="tile"><div class="small">' + escapeHtml(label) + '</div><div style="margin-top:8px;font-weight:700;line-height:1.7">' + content + "</div></div>";
      }

      function renderInput(scope, key, label, value) {
        return '<label class="field"><span class="small">' + escapeHtml(label) + '</span><input class="input" data-bind="' + scope + '" data-key="' + key + '" value="' + escapeHtml(value) + '" /></label>';
      }

      function renderSelect(scope, key, label, options, value) {
        return '<label class="field"><span class="small">' + escapeHtml(label) + '</span><select class="select" data-bind="' + scope + '" data-key="' + key + '">' +
          options.map(function (option) {
            return '<option value="' + escapeHtml(option) + '"' + (option === value ? " selected" : "") + ">" + escapeHtml(option) + "</option>";
          }).join("") +
          "</select></label>";
      }

      function renderCheckboxGroup(scope, key, options, selected) {
        return '<div class="check-grid" style="margin-top:10px">' +
          options.map(function (option) {
            const checked = selected.includes(option);
            return '<label class="check"><input type="checkbox" data-bind="' + scope + '" data-key="' + key + '" value="' + escapeHtml(option) + '"' + (checked ? " checked" : "") + " />" + escapeHtml(option) + "</label>";
          }).join("") +
          "</div>";
      }

      function renderFilterGroup(label, options, selected, action) {
        return '<div style="margin-top:16px"><div class="small">' + escapeHtml(label) + '</div><div class="chips" style="margin-top:10px">' +
          options.map(function (option) {
            const active = selected.includes(option);
            return '<button class="btn' + (active ? " primary" : "") + '" data-action="' + action + '" data-value="' + escapeHtml(option) + '" style="padding:8px 12px;font-size:13px">' + escapeHtml(option) + "</button>";
          }).join("") +
        "</div></div>";
      }

      function openBrokerBuildingForm(mode) {
        const building = getBuilding(ui.broker.selectedBuildingId);
        ui.broker.mode = "buildingForm";
        ui.broker.buildingDraft = mode === "edit" && building ? makeBuildingDraft(building) : makeBuildingDraft();
      }

      function openBrokerSuiteForm(mode, suiteId) {
        const building = getBuilding(ui.broker.selectedBuildingId);
        if (!building) {
          alert("请先选择或新增楼栋，再新增 Suite。");
          return;
        }
        const suite = mode === "edit" ? getSuite(building, suiteId) : null;
        ui.broker.mode = "suiteForm";
        ui.broker.suiteStep = 1;
        ui.broker.suiteDraft = makeSuiteDraft(building.id, suite);
        if (suite) ui.broker.selectedSuiteId = suite.id;
      }

      function brokerSaveBuilding() {
        const draft = ui.broker.buildingDraft;
        if (!draft.rawAddress.trim() || !draft.name.trim()) {
          alert("请先填写完整地址和楼栋名称。");
          return;
        }
        if (draft.id) {
          const building = getBuilding(draft.id);
          if (building) {
            building.name = draft.name;
            building.rawAddress = draft.rawAddress;
            building.city = draft.city;
            building.state = draft.state;
            building.zip = draft.zip;
            building.paymentFlowStatus = draft.paymentFlowStatus;
            building.paymentFlowNote = draft.paymentFlowNote;
            building.electricBillMode = draft.electricBillMode;
            building.broadbandBillStatus = draft.broadbandBillStatus;
            building.rentIncludes = draft.rentIncludes.slice();
            building.mailScan = draft.mailScan;
            building.forwarding = draft.forwarding;
            building.furniture = draft.furniture;
            building.lockOptions = draft.lockOptions.slice();
            building.exteriorPhotos = draft.exteriorPhotos.slice();
            building.doorplatePhotos = draft.doorplatePhotos.slice();
          }
        } else {
          const nextId = "b" + (Date.now() % 100000);
          state.buildings.unshift({
            id: nextId,
            name: draft.name,
            rawAddress: draft.rawAddress,
            city: draft.city,
            state: draft.state,
            zip: draft.zip,
            reviewStatus: "待预审",
            maintainerName: "当前中介",
            maintainerId: "broker-self",
            paymentFlowStatus: draft.paymentFlowStatus,
            paymentFlowNote: draft.paymentFlowNote,
            electricBillMode: draft.electricBillMode,
            broadbandBillStatus: draft.broadbandBillStatus,
            verificationSource: "中介口头确认",
            rentIncludes: draft.rentIncludes.slice(),
            mailScan: draft.mailScan,
            forwarding: draft.forwarding,
            furniture: draft.furniture,
            lockOptions: draft.lockOptions.slice(),
            exteriorPhotos: draft.exteriorPhotos.slice(),
            doorplatePhotos: draft.doorplatePhotos.slice(),
            suites: [],
          });
          ui.broker.selectedBuildingId = nextId;
          ui.admin.selectedBuildingId = nextId;
        }
        ui.broker.mode = "dashboard";
        renderAll();
      }

      function brokerSaveSuite(mode) {
        const draft = ui.broker.suiteDraft;
        const building = getBuilding(draft.buildingId);
        if (!building) {
          alert("请先保存楼栋信息。");
          return;
        }
        if (!draft.suite.trim()) {
          alert("请先填写 Suite / 房间号。");
          return;
        }
        if (mode === "submit" && building.exteriorPhotos.length < 2) {
          alert("提交前请补齐楼栋外围至少 2 张照片。");
          return;
        }
        if (mode === "submit" && draft.insidePhotos.length < 2) {
          alert("提交前请补齐房间内部至少 2 张照片。");
          return;
        }
        const auditStatus = mode === "draft" ? "草稿" : "待审核";
        if (draft.id) {
          const suite = getSuite(building, draft.id);
          if (suite) {
            suite.suite = draft.suite;
            suite.area = Number(draft.area || 0);
            suite.rent = Number(draft.rent || 0);
            suite.status = draft.status;
            suite.suitability = draft.suitability;
            suite.tags = draft.tags.slice();
            suite.remark = draft.remark;
            suite.insidePhotos = draft.insidePhotos.slice();
            suite.doorPhotos = draft.doorPhotos.slice();
            suite.auditStatus = auditStatus;
            if (mode === "submit") suite.tenantDisplay = "暂停推荐";
          }
        } else {
          const nextId = "s" + (Date.now() % 100000);
          building.suites.unshift({
            id: nextId,
            suite: draft.suite,
            area: Number(draft.area || 0),
            rent: Number(draft.rent || 0),
            status: draft.status,
            auditStatus: auditStatus,
            tenantDisplay: "暂停推荐",
            suitability: draft.suitability,
            tags: draft.tags.slice(),
            remark: draft.remark,
            insidePhotos: draft.insidePhotos.slice(),
            doorPhotos: draft.doorPhotos.slice(),
          });
          ui.broker.selectedSuiteId = nextId;
          ui.admin.selectedSuiteId = nextId;
          state.views[nextId] = 0;
        }
        ui.broker.mode = "dashboard";
        renderAll();
      }

      function toggleArrayValue(array, value) {
        return array.includes(value) ? array.filter(function (item) { return item !== value; }) : array.concat(value);
      }

      function tenantOpenDetail(suiteId) {
        ui.tenant.detailSuiteId = suiteId;
        ui.tenant.showPaymentNote = false;
        state.views[suiteId] = (state.views[suiteId] || 0) + 1;
        renderAll();
      }

      function adminApplyBatch(mode) {
        const building = getBuilding(ui.admin.selectedBuildingId);
        if (!building || ui.admin.checkedSuiteIds.length === 0) {
          alert("请先选择至少一个房间。");
          return;
        }
        building.suites.forEach(function (suite) {
          if (!ui.admin.checkedSuiteIds.includes(suite.id)) return;
          if (mode === "approve") {
            suite.auditStatus = "已审核通过";
            suite.tenantDisplay = "可展示";
          } else if (mode === "return") {
            suite.auditStatus = "待补充";
            suite.tenantDisplay = "暂停推荐";
          } else if (mode === "pause") {
            suite.tenantDisplay = "暂停推荐";
          } else if (mode === "rented") {
            suite.status = "已出租";
            suite.tenantDisplay = "已出租";
          }
        });
        ui.admin.checkedSuiteIds = [];
        renderAll();
      }

      async function readFiles(fileList) {
        const files = Array.from(fileList || []);
        return Promise.all(
          files.map(function (file, index) {
            return new Promise(function (resolve) {
              const reader = new FileReader();
              reader.onload = function () {
                resolve({
                  id: "upload-" + Date.now() + "-" + index,
                  name: file.name,
                  url: String(reader.result || ""),
                });
              };
              reader.onerror = function () {
                resolve(makePhoto(file.name, "#dce3ea"));
              };
              reader.readAsDataURL(file);
            });
          }),
        );
      }

      function renderAll() {
        ui.route = routeFromHash();
        renderHomeTabs();
        renderBroker();
        renderTenant();
        renderAdmin();
      }
