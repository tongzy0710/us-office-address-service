      function renderBroker() {
        const root = document.getElementById("broker-app");
        const building = getBuilding(ui.broker.selectedBuildingId);
        if (building && !ui.broker.selectedBuildingId) {
          ui.broker.selectedBuildingId = building.id;
        }
        const suites = building ? building.suites.slice() : [];
        const filteredSuites = suites.filter(function (suite) {
          if (ui.broker.filter === "draft") return suite.auditStatus === "草稿";
          if (ui.broker.filter === "supplement") return suite.auditStatus === "待补充";
          if (ui.broker.filter === "submitted") return suite.auditStatus === "待审核" || suite.auditStatus === "已审核通过";
          return true;
        });
        const draftCount = allSuites().filter(function (row) { return row.suite.auditStatus === "草稿"; }).length;
        const supplementCount = allSuites().filter(function (row) { return row.suite.auditStatus === "待补充"; }).length;
        const submittedCount = allSuites().filter(function (row) { return row.suite.auditStatus === "待审核" || row.suite.auditStatus === "已审核通过"; }).length;

        root.innerHTML =
          '<div class="layout two">' +
            '<div class="stack">' +
              '<div class="phone"><div class="phone-inner"><div class="notch"></div>' +
                '<div class="stack">' +
                  '<div><div class="eyebrow" style="color:var(--broker)">中介账号</div><h2 style="margin-top:8px">My Office</h2><p class="copy" style="font-size:14px">结构：中介账号 → My Office → 楼栋 → Suite</p></div>' +
                  '<button class="btn broker" data-action="broker-open-building" data-mode="new" style="width:100%;padding:16px 18px;font-size:16px">+ 快速新增楼栋</button>' +
                  '<div class="record"><strong>我的草稿箱</strong><div class="small" style="margin-top:4px">' + draftCount + ' 套待继续完善</div></div>' +
                  '<div class="record"><strong>已提交</strong><div class="small" style="margin-top:4px">包含待审核和已审核状态，共 ' + submittedCount + ' 套</div></div>' +
                  '<div class="record"><strong>待补充</strong><div class="small" style="margin-top:4px">当前 ' + supplementCount + ' 套</div></div>' +
                  '<div class="record"><strong>我的 Office</strong><div class="small" style="margin-top:4px">点击楼栋进入楼栋首页和 Suite 列表</div></div>' +
                "</div></div></div>" +
              '<div class="panel" style="padding:22px">' +
                '<div class="section-title"><h3>我的楼栋</h3><span class="small">首页展示 8 条以内</span></div>' +
                '<div class="stack" style="margin-top:16px">' +
                  (state.buildings.length
                    ? state.buildings.slice(0, 8).map(function (item) {
                        return '<button class="record" data-action="broker-select-building" data-building-id="' +
                          item.id +
                          '" style="text-align:left;' +
                          (building && item.id === building.id ? "border-color:var(--broker);background:#fff8f3" : "") +
                          '">' +
                          '<div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><div><strong>' +
                          escapeHtml(item.name) +
                          '</strong><div class="small" style="margin-top:6px">' +
                          escapeHtml(item.rawAddress) +
                          '</div></div>' +
                          chip(item.reviewStatus) +
                          "</div>" +
                          '<div class="small" style="margin-top:10px">' + item.suites.length + " 个 Suite</div></button>";
                      }).join("")
                    : '<div class="empty">还没有楼栋，请先新增楼栋。</div>') +
                "</div></div>" +
              '<div class="panel" style="padding:22px"><h3>状态筛选</h3><div class="subnav" style="margin-top:16px">' +
                brokerFilterButton("all", "全部") +
                brokerFilterButton("draft", "我的草稿箱") +
                brokerFilterButton("supplement", "待补充") +
                brokerFilterButton("submitted", "已提交") +
              '</div><div class="note" style="margin-top:16px">中介端先负责采集信息和上传照片，地址是否满足平台独立地址要求，统一放到管理端判断。</div></div>' +
            "</div>" +
            '<div class="stack">' +
              (ui.broker.mode === "buildingForm"
                ? renderBrokerBuildingForm()
                : ui.broker.mode === "suiteForm"
                  ? renderBrokerSuiteForm()
                  : renderBrokerDashboard(building, filteredSuites)) +
            "</div>" +
          "</div>";
      }

      function brokerFilterButton(value, label) {
        return '<button class="' + (ui.broker.filter === value ? "active" : "") + '" data-action="broker-set-filter" data-value="' + value + '">' + label + "</button>";
      }

      function renderBrokerDashboard(building, suites) {
        if (!building) {
          return '<div class="panel" style="padding:24px"><div class="empty">请先新增楼栋。</div></div>';
        }
        return '' +
          '<div class="panel" style="padding:22px">' +
            '<div class="section-title"><div><div class="eyebrow" style="color:var(--broker)">楼栋首页</div><h2 style="margin-top:8px">' + escapeHtml(building.name) + '</h2></div>' +
            '<div class="actions"><button class="btn subtle" data-action="broker-open-building" data-mode="edit">编辑楼栋</button><button class="btn broker" data-action="broker-open-suite" data-mode="new">+ 新增 Suite</button></div></div>' +
            '<div class="field-grid" style="margin-top:18px">' +
              renderInfoTile("地址信息", building.rawAddress + "<br />" + building.city + " / " + building.state + " / " + building.zip) +
              renderInfoTile("关键信息", "标准付款流程：" + building.paymentFlowStatus + "<br />电费账单：" + electricBillLabel(building.electricBillMode) + "<br />宽带账单：" + broadbandLabel(building.broadbandBillStatus)) +
              renderInfoTile("服务信息", "租金包含：" + (building.rentIncludes.length ? building.rentIncludes.join(" / ") : "待确认") + "<br />信件扫描：" + building.mailScan + "<br />转寄服务：" + building.forwarding) +
              renderInfoTile("补充能力", "家具：" + building.furniture + "<br />非必需能力：" + (building.lockOptions.length ? building.lockOptions.join(" / ") : "未补充")) +
            "</div>" +
            '<div class="split" style="margin-top:18px">' +
              '<div class="record"><strong>楼栋外围照片</strong>' + photoGrid(building.exteriorPhotos) + "</div>" +
              '<div class="record"><strong>楼栋门牌照片</strong>' + photoGrid(building.doorplatePhotos) + "</div>" +
            "</div>" +
          "</div>" +
          '<div class="panel" style="padding:22px">' +
            '<div class="section-title"><div><h3>Suite 列表</h3><div class="small" style="margin-top:6px">点击 Suite 可进入具体填写和编辑页面</div></div><button class="btn broker" data-action="broker-open-suite" data-mode="new">+ 新增 Suite</button></div>' +
            '<div class="stack" style="margin-top:16px">' +
              (suites.length
                ? suites.map(function (suite) {
                    return '<button class="record" data-action="broker-open-suite" data-mode="edit" data-suite-id="' +
                      suite.id +
                      '" style="text-align:left">' +
                      '<div style="display:flex;justify-content:space-between;gap:10px;align-items:start"><div><strong>' +
                      escapeHtml(suite.suite) +
                      '</strong><div class="small" style="margin-top:6px">' +
                      suite.area +
                      " SF · " +
                      formatMoney(suite.rent) +
                      ' / 月</div></div>' +
                      chip(suite.status) +
                      "</div>" +
                      '<div class="chips" style="margin-top:10px">' +
                      chip(suite.auditStatus) +
                      chip(suite.suitability === "适合跨境电商客户" ? suite.suitability : suite.suitability, suite.suitability === "适合跨境电商客户" ? "good" : "info") +
                      "</div>" +
                      '<div class="small" style="margin-top:10px">内部照片 ' +
                      suite.insidePhotos.length +
                      " 张 · 房门/门牌 " +
                      suite.doorPhotos.length +
                      " 张</div></button>";
                  }).join("")
                : '<div class="empty">当前楼栋还没有 Suite，请先新增。</div>') +
            "</div>" +
          "</div>";
      }

      function renderBrokerBuildingForm() {
        const draft = ui.broker.buildingDraft;
        return '' +
          '<div class="panel" style="padding:22px">' +
            '<div class="section-title"><div><div class="eyebrow" style="color:var(--broker)">楼栋信息</div><h2 style="margin-top:8px">' + (draft.id ? "编辑楼栋" : "新增楼栋") + '</h2></div><div class="actions"><button class="btn subtle" data-action="broker-cancel">返回楼栋首页</button><button class="btn broker" data-action="broker-save-building">保存楼栋</button></div></div>' +
            '<div class="stack" style="margin-top:20px">' +
              '<div class="record"><strong>地址信息</strong><div class="field-grid" style="margin-top:14px">' +
                renderInput("broker-building", "rawAddress", "完整地址", draft.rawAddress) +
                renderInput("broker-building", "name", "楼栋名称", draft.name) +
                renderInput("broker-building", "city", "城市", draft.city) +
                renderInput("broker-building", "state", "州", draft.state) +
                renderInput("broker-building", "zip", "邮编", draft.zip) +
              "</div></div>" +
              '<div class="record"><strong>关键信息</strong><div class="field-grid" style="margin-top:14px">' +
                renderSelect("broker-building", "paymentFlowStatus", "标准签约付款流程", PAYMENT_OPTIONS, draft.paymentFlowStatus) +
                renderSelect("broker-building", "electricBillMode", "电费账单提供能力", ELECTRIC_OPTIONS, draft.electricBillMode) +
                renderSelect("broker-building", "broadbandBillStatus", "宽带账单提供能力", BROADBAND_OPTIONS, draft.broadbandBillStatus) +
                '<label class="field"><span class="small">付款流程说明</span><textarea class="textarea" data-bind="broker-building" data-key="paymentFlowNote">' +
                escapeHtml(draft.paymentFlowNote) +
                "</textarea></label>" +
              '</div><div style="margin-top:14px"><div class="small">租金包含项</div>' +
                renderCheckboxGroup("broker-building-array", "rentIncludes", RENT_INCLUDE_OPTIONS, draft.rentIncludes) +
              "</div></div>" +
              '<div class="record"><strong>服务信息</strong><div class="field-grid" style="margin-top:14px">' +
                renderSelect("broker-building", "mailScan", "信件扫描服务", MAIL_OPTIONS, draft.mailScan) +
                renderSelect("broker-building", "forwarding", "境内 / 国际转寄服务", MAIL_OPTIONS, draft.forwarding) +
                renderSelect("broker-building", "furniture", "家具情况", FURNITURE_OPTIONS, draft.furniture) +
              '</div><div style="margin-top:14px"><div class="small">非必需能力</div>' +
                renderCheckboxGroup("broker-building-array", "lockOptions", LOCK_OPTIONS, draft.lockOptions) +
              "</div></div>" +
              '<div class="record"><strong>楼栋照片上传</strong><div class="field-grid" style="margin-top:14px">' +
                '<div><div class="small">楼栋外围照片（至少 2 张）</div><input class="input" type="file" accept="image/*" multiple data-upload="broker-building-exterior" style="margin-top:10px" />' +
                photoGrid(draft.exteriorPhotos) +
                "</div>" +
                '<div><div class="small">楼栋门牌照片</div><input class="input" type="file" accept="image/*" multiple data-upload="broker-building-doorplate" style="margin-top:10px" />' +
                photoGrid(draft.doorplatePhotos) +
                "</div>" +
              "</div></div>" +
            "</div>" +
          "</div>";
      }

      function renderBrokerSuiteForm() {
        const draft = ui.broker.suiteDraft;
        const building = getBuilding(draft.buildingId);
        const step = ui.broker.suiteStep;
        return '' +
          '<div class="panel" style="padding:22px">' +
            '<div class="section-title"><div><div class="eyebrow" style="color:var(--broker)">Suite 信息</div><h2 style="margin-top:8px">' + (draft.id ? "编辑 Suite" : "新增 Suite") + '</h2><div class="small" style="margin-top:6px">' + escapeHtml(building ? building.name : "未选择楼栋") + "</div></div>" +
            '<div class="actions"><button class="btn subtle" data-action="broker-cancel">返回楼栋首页</button><button class="btn" data-action="broker-save-suite" data-mode="draft">保存草稿</button><button class="btn broker" data-action="broker-save-suite" data-mode="submit">提交审核</button></div></div>' +
            '<div class="subnav" style="margin-top:18px">' +
              suiteStepButton(1, "1 基础信息") +
              suiteStepButton(2, "2 状态与标签") +
              suiteStepButton(3, "3 照片上传") +
            "</div>" +
            '<div class="stack" style="margin-top:20px">' +
              (step === 1 ? renderSuiteStepOne(draft) : step === 2 ? renderSuiteStepTwo(draft) : renderSuiteStepThree(draft)) +
            "</div></div>";
      }

      function suiteStepButton(step, label) {
        return '<button class="' + (ui.broker.suiteStep === step ? "active" : "") + '" data-action="broker-step" data-step="' + step + '">' + label + "</button>";
      }

      function renderSuiteStepOne(draft) {
        return '<div class="record"><strong>基础信息</strong><div class="field-grid" style="margin-top:14px">' +
          renderInput("broker-suite", "suite", "Suite / 房间号", draft.suite) +
          renderSelect("broker-suite", "status", "Suite 状态", SUITE_STATUS_OPTIONS, draft.status) +
          renderInput("broker-suite", "area", "面积（SF）", draft.area) +
          renderInput("broker-suite", "rent", "月租金（USD）", draft.rent) +
          renderSelect("broker-suite", "suitability", "是否适合跨境电商客户", ["适合跨境电商客户", "不适合", "待判断"], draft.suitability) +
          '<label class="field"><span class="small">备注</span><textarea class="textarea" data-bind="broker-suite" data-key="remark">' +
          escapeHtml(draft.remark) +
          "</textarea></label>" +
        "</div></div>";
      }

      function renderSuiteStepTwo(draft) {
        return '<div class="record"><strong>房间状态标签</strong><div class="helper" style="margin-top:6px">同类型问题已合并，避免让中介感觉问题过多。</div>' +
          renderCheckboxGroup("broker-suite-array", "tags", STATUS_TAG_OPTIONS, draft.tags) +
          '<div class="note" style="margin-top:16px">Suite 级别尽量只保留必要字段：房间号、当前可用状态、面积、月租金、是否适合跨境电商客户、标签和备注。</div></div>';
      }

      function renderSuiteStepThree(draft) {
        return '<div class="record"><strong>照片上传</strong><div class="field-grid" style="margin-top:14px">' +
          '<div><div class="small">房间内部照片（至少 2 张）</div><input class="input" type="file" accept="image/*" multiple data-upload="broker-suite-inside" style="margin-top:10px" />' +
          '<div class="small" style="margin-top:8px">当前已上传 ' + draft.insidePhotos.length + ' 张</div>' +
          photoGrid(draft.insidePhotos) +
          "</div>" +
          '<div><div class="small">房门 / 门牌照片</div><input class="input" type="file" accept="image/*" multiple data-upload="broker-suite-door" style="margin-top:10px" />' +
          '<div class="small" style="margin-top:8px">当前已上传 ' + draft.doorPhotos.length + ' 张</div>' +
          photoGrid(draft.doorPhotos) +
          "</div>" +
        "</div></div>";
      }

      function renderTenant() {
        const root = document.getElementById("tenant-app");
        const listings = tenantFilteredListings();
        const detail = ui.tenant.detailSuiteId
          ? listings.concat(visibleTenantListings()).find(function (item) { return item.id === ui.tenant.detailSuiteId; })
          : null;

        if (detail) {
          root.innerHTML = renderTenantDetail(detail);
          return;
        }

        const cityOptions = Array.from(new Set(visibleTenantListings().map(function (item) { return item.city; }))).sort();
        root.innerHTML =
          '<div class="stack">' +
            '<div class="cards">' +
              renderMetric("当前可浏览 Suite", listings.length + " 套", "已审核通过且允许展示") +
              renderMetric("可租赁房源", listings.filter(function (item) { return item.status === "可租赁"; }).length + " 套", "默认优先推荐") +
              renderMetric("可提供宽带账单", listings.filter(function (item) { return item.broadbandBillStatus === "有"; }).length + " 套", "独立、公司抬头口径") +
            "</div>" +
            '<div class="layout two">' +
              '<div class="stack">' +
                '<div class="panel" style="padding:22px"><h2>搜索与筛选</h2>' +
                  '<label class="field" style="margin-top:16px"><span class="small">关键词搜索</span><input class="input" data-bind="tenant" data-key="search" value="' + escapeHtml(ui.tenant.search) + '" placeholder="城市 / 地址 / 楼栋 / Suite" /></label>' +
                  renderFilterGroup("价格范围", PRICE_BANDS, ui.tenant.prices, "tenant-toggle-price") +
                  renderFilterGroup("城市", cityOptions, ui.tenant.cities, "tenant-toggle-city") +
                  renderFilterGroup("标准付款流程", PAYMENT_OPTIONS, ui.tenant.payments, "tenant-toggle-payment") +
                  renderFilterGroup("电费账单状态", ELECTRIC_OPTIONS, ui.tenant.electric, "tenant-toggle-electric") +
                  renderFilterGroup("宽带账单状态", BROADBAND_OPTIONS, ui.tenant.broadband, "tenant-toggle-broadband") +
                  renderFilterGroup("Suite 状态", SUITE_STATUS_OPTIONS, ui.tenant.statuses, "tenant-toggle-status") +
                  '<button class="btn subtle" data-action="tenant-clear-filters" style="margin-top:16px;width:100%">清空筛选</button>' +
                "</div>" +
                '<div class="panel" style="padding:22px"><h2>租客端逻辑</h2><div class="note" style="margin-top:14px">租客端直接展示 Suite 信息，点击“查看详情”以后，才带出对应楼栋信息、服务能力、付款流程和全部照片。浏览阶段无需登录，联系客服时再输入手机号。</div></div>' +
              "</div>" +
              '<div class="stack">' +
                '<div class="panel" style="padding:22px"><div class="section-title"><div><h2>火热房源</h2><div class="small" style="margin-top:6px">按浏览量最高且可租赁展示</div></div>' + chip("默认按价格从低到高") + '</div><div class="cards" style="margin-top:16px">' +
                  hotListings().map(function (item) { return tenantCard(item, true); }).join("") +
                "</div></div>" +
                '<div class="panel" style="padding:22px"><div class="section-title"><div><h2>Suite 列表</h2><div class="small" style="margin-top:6px">首页展示前 8 套</div></div>' + chip(listings.length + " 套结果", "info") + '</div>' +
                  (listings.length
                    ? '<div class="cards" style="margin-top:16px;grid-template-columns:repeat(2,minmax(0,1fr))">' +
                      listings.slice(0, 8).map(function (item) { return tenantCard(item, false); }).join("") +
                      "</div>"
                    : '<div class="empty" style="margin-top:16px">当前筛选条件下没有符合要求的 Suite。</div>') +
                "</div>" +
              "</div>" +
            "</div>" +
          "</div>";
      }

      function renderTenantDetail(item) {
        return '' +
          '<div class="layout detail">' +
            '<div class="stack">' +
              '<div class="panel" style="padding:22px">' +
                '<div class="section-title"><div><div class="eyebrow" style="color:var(--tenant)">Suite 详情</div><h2 style="margin-top:8px">' + escapeHtml(item.buildingName) + " / " + escapeHtml(item.suite) + '</h2></div><button class="btn subtle" data-action="tenant-back">返回列表</button></div>' +
                '<div class="field-grid" style="margin-top:16px">' +
                  renderInfoTile("地址", item.address) +
                  renderInfoTile("月租 / 面积", formatMoney(item.rent) + " / 月 · " + item.area + " SF") +
                  renderInfoTile("Suite 状态", item.status) +
                  renderInfoTile("标准付款流程接受度", item.paymentFlowStatus) +
                "</div>" +
                '<div class="chips" style="margin-top:14px">' +
                  chip(item.status) +
                  chip(electricBillLabel(item.electricBillMode), "info") +
                  chip(broadbandLabel(item.broadbandBillStatus), item.broadbandBillStatus === "有" ? "good" : "warn") +
                "</div>" +
              "</div>" +
              '<div class="field-grid">' +
                '<div class="record"><strong>房间内部照片</strong>' + photoGrid(item.insidePhotos) + "</div>" +
                '<div class="record"><strong>房门 / 门牌照片</strong>' + photoGrid(item.doorPhotos) + "</div>" +
                '<div class="record"><strong>楼栋外围照片</strong>' + photoGrid(item.exteriorPhotos) + "</div>" +
                '<div class="record"><strong>楼栋门牌照片</strong>' + photoGrid(item.doorplatePhotos) + "</div>" +
              "</div>" +
              '<div class="split">' +
                '<div class="panel" style="padding:22px"><h3>账单与关键能力</h3>' +
                  '<div class="record" style="margin-top:14px"><div class="small">电费账单状态</div><strong>' + electricBillLabel(item.electricBillMode) + '</strong></div>' +
                  '<div class="record" style="margin-top:12px"><div class="small">宽带账单状态</div><strong>' + broadbandLabel(item.broadbandBillStatus) + '</strong></div>' +
                  '<div class="record" style="margin-top:12px"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><div class="small">标准付款流程</div>' +
                    chip(item.paymentFlowStatus) +
                    '<button class="pill-link" data-action="tenant-toggle-note">?</button></div>' +
                    (ui.tenant.showPaymentNote ? '<div class="note" style="margin-top:10px">' + escapeHtml(item.paymentFlowNote || paymentFlowHint()) + "</div>" : "") +
                  "</div>" +
                  '<div class="record" style="margin-top:12px"><div class="small">租金包含项</div><strong>' + (item.rentIncludes.length ? item.rentIncludes.join(" / ") : "待确认") + "</strong></div>" +
                "</div>" +
                '<div class="panel" style="padding:22px"><h3>楼栋服务信息</h3><div class="note" style="margin-top:14px">信件扫描：' + escapeHtml(item.mailScan) + "<br />境内 / 国际转寄：" + escapeHtml(item.forwarding) + "<br />家具情况：" + escapeHtml(item.furniture) + "<br />非必需能力：" + escapeHtml(item.lockOptions.length ? item.lockOptions.join(" / ") : "未补充") + "<br />房间状态标签：" + escapeHtml(item.tags.length ? item.tags.join(" / ") : "未补充") + "<br />备注：" + escapeHtml(item.remark || "暂无额外说明") + "</div></div>" +
              "</div>" +
            "</div>" +
            '<div class="stack">' +
              '<div class="panel" style="padding:22px"><div class="eyebrow" style="color:var(--tenant)">联系客服</div><h2 style="margin-top:8px">浏览无需登录</h2><p class="copy" style="margin-top:10px">只有在想联系后台时，才需要输入手机号进行登记。</p>' +
                (ui.tenant.contactUnlocked
                  ? '<div class="note" style="margin-top:16px">已登记手机号：' + escapeHtml(ui.tenant.contactPhone) + '<br />微信：' + escapeHtml(state.contacts.wechat) + '<br />电话：' + escapeHtml(state.contacts.phone) + '<br />邮箱：' + escapeHtml(state.contacts.email) + "</div>"
                  : '<div class="stack" style="margin-top:16px"><input class="input" data-bind="tenant" data-key="contactPhone" placeholder="请输入手机号" value="' + escapeHtml(ui.tenant.contactPhone) + '" /><input class="input" data-bind="tenant" data-key="contactName" placeholder="公司或姓名（可选）" value="' + escapeHtml(ui.tenant.contactName) + '" /><button class="btn tenant" data-action="tenant-unlock-contact">确认并查看联系方式</button>' + (ui.tenant.contactError ? '<div class="chip danger">' + escapeHtml(ui.tenant.contactError) + "</div>" : "") + "</div>") +
              "</div>" +
              '<div class="panel" style="padding:22px"><h2>租客端查看逻辑</h2><div class="note" style="margin-top:14px">租客端直接看 Suite，点击详情后再看到对应楼栋信息。你现在看到的图片，和中介端上传、管理端审核的是同一批文件。</div></div>' +
            "</div>" +
          "</div>";
      }

      function tenantCard(item, hot) {
        const cover = item.insidePhotos[0] || item.exteriorPhotos[0];
        return '<div class="record">' +
          '<div class="cover"' + (cover ? ' style="background-image:url(\'' + cover.url + '\')"' : "") + "></div>" +
          '<strong style="display:block;margin-top:12px">' + escapeHtml(item.buildingName) + " / " + escapeHtml(item.suite) + "</strong>" +
          '<div class="small" style="margin-top:6px">' + escapeHtml(item.address) + "</div>" +
          '<div class="chips" style="margin-top:10px">' +
            chip(item.status) +
            chip(item.paymentFlowStatus === "接受" ? "标准付款流程：可接受" : "标准付款流程：" + item.paymentFlowStatus, item.paymentFlowStatus === "接受" ? "good" : toneFor(item.paymentFlowStatus)) +
          "</div>" +
          '<div class="small" style="margin-top:10px">' + formatMoney(item.rent) + " / 月 · " + item.area + " SF · 浏览量 " + item.viewCount + (hot ? " · 火热房源" : "") + "</div>" +
          '<div class="actions" style="margin-top:14px"><button class="btn tenant" data-action="tenant-open-detail" data-suite-id="' + item.id + '">查看详情</button></div>' +
        "</div>";
      }

      function renderAdmin() {
        const root = document.getElementById("admin-app");
        const building = getBuilding(ui.admin.selectedBuildingId);
        if (building) {
          ui.admin.buildingReviewDraft = ui.admin.buildingReviewDraft || building.reviewStatus;
        }
        const suite = getSuite(building, ui.admin.selectedSuiteId);
        if (suite) {
          ui.admin.suiteAuditDraft = ui.admin.suiteAuditDraft || suite.auditStatus;
          ui.admin.suiteStatusDraft = ui.admin.suiteStatusDraft || suite.status;
          ui.admin.suiteDisplayDraft = ui.admin.suiteDisplayDraft || suite.tenantDisplay;
          if (!ui.admin.suiteRemarkDraft) ui.admin.suiteRemarkDraft = suite.remark || BLANK;
        }

        root.innerHTML =
          '<div class="stack">' +
            '<div class="cards">' +
              renderMetric("楼栋总数", state.buildings.length, "所有录入楼栋") +
