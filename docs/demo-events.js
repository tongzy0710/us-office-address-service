      document.addEventListener("click", function (event) {
        const target = event.target.closest("[data-action], .tab[data-route]");
        if (!target) return;

        if (target.classList.contains("tab") && target.dataset.route) {
          location.hash = target.dataset.route;
          return;
        }

        const action = target.dataset.action;

        if (action === "broker-select-building") {
          ui.broker.selectedBuildingId = target.dataset.buildingId;
          ui.admin.selectedBuildingId = target.dataset.buildingId;
          ui.broker.mode = "dashboard";
          renderAll();
          return;
        }

        if (action === "broker-set-filter") {
          ui.broker.filter = target.dataset.value;
          renderAll();
          return;
        }

        if (action === "broker-open-building") {
          openBrokerBuildingForm(target.dataset.mode);
          renderAll();
          return;
        }

        if (action === "broker-open-suite") {
          openBrokerSuiteForm(target.dataset.mode, target.dataset.suiteId);
          renderAll();
          return;
        }

        if (action === "broker-cancel") {
          ui.broker.mode = "dashboard";
          renderAll();
          return;
        }

        if (action === "broker-save-building") {
          brokerSaveBuilding();
          return;
        }

        if (action === "broker-step") {
          ui.broker.suiteStep = Number(target.dataset.step || 1);
          renderAll();
          return;
        }

        if (action === "broker-save-suite") {
          brokerSaveSuite(target.dataset.mode);
          return;
        }

        if (action === "tenant-toggle-price") {
          ui.tenant.prices = toggleArrayValue(ui.tenant.prices, target.dataset.value);
          renderAll();
          return;
        }

        if (action === "tenant-toggle-city") {
          ui.tenant.cities = toggleArrayValue(ui.tenant.cities, target.dataset.value);
          renderAll();
          return;
        }

        if (action === "tenant-toggle-payment") {
          ui.tenant.payments = toggleArrayValue(ui.tenant.payments, target.dataset.value);
          renderAll();
          return;
        }

        if (action === "tenant-toggle-electric") {
          ui.tenant.electric = toggleArrayValue(ui.tenant.electric, target.dataset.value);
          renderAll();
          return;
        }

        if (action === "tenant-toggle-broadband") {
          ui.tenant.broadband = toggleArrayValue(ui.tenant.broadband, target.dataset.value);
          renderAll();
          return;
        }

        if (action === "tenant-toggle-status") {
          ui.tenant.statuses = toggleArrayValue(ui.tenant.statuses, target.dataset.value);
          renderAll();
          return;
        }

        if (action === "tenant-clear-filters") {
          ui.tenant.search = BLANK;
          ui.tenant.prices = [];
          ui.tenant.cities = [];
          ui.tenant.payments = [];
          ui.tenant.electric = [];
          ui.tenant.broadband = [];
          ui.tenant.statuses = [];
          renderAll();
          return;
        }

        if (action === "tenant-open-detail") {
          tenantOpenDetail(target.dataset.suiteId);
          return;
        }

        if (action === "tenant-back") {
          ui.tenant.detailSuiteId = null;
          ui.tenant.showPaymentNote = false;
          renderAll();
          return;
        }

        if (action === "tenant-toggle-note") {
          ui.tenant.showPaymentNote = !ui.tenant.showPaymentNote;
          renderAll();
          return;
        }

        if (action === "tenant-unlock-contact") {
          if (!ui.tenant.contactPhone.trim()) {
            ui.tenant.contactError = "请先输入手机号。";
          } else {
            ui.tenant.contactError = BLANK;
            ui.tenant.contactUnlocked = true;
          }
          renderAll();
          return;
        }

        if (action === "admin-select-building") {
          ui.admin.selectedBuildingId = target.dataset.buildingId;
          ui.admin.checkedSuiteIds = [];
          const building = getBuilding(ui.admin.selectedBuildingId);
          ui.admin.buildingReviewDraft = building ? building.reviewStatus : "待预审";
          const suite = building ? building.suites[0] : null;
          ui.admin.selectedSuiteId = suite ? suite.id : null;
          ui.admin.suiteAuditDraft = suite ? suite.auditStatus : "待审核";
          ui.admin.suiteStatusDraft = suite ? suite.status : "待确认";
          ui.admin.suiteDisplayDraft = suite ? suite.tenantDisplay : "暂停推荐";
          ui.admin.suiteRemarkDraft = suite ? suite.remark || BLANK : BLANK;
          renderAll();
          return;
        }

        if (action === "admin-select-suite") {
          const building = getBuilding(ui.admin.selectedBuildingId);
          const suite = getSuite(building, target.dataset.suiteId);
          ui.admin.selectedSuiteId = target.dataset.suiteId;
          ui.admin.suiteAuditDraft = suite ? suite.auditStatus : "待审核";
          ui.admin.suiteStatusDraft = suite ? suite.status : "待确认";
          ui.admin.suiteDisplayDraft = suite ? suite.tenantDisplay : "暂停推荐";
          ui.admin.suiteRemarkDraft = suite ? suite.remark || BLANK : BLANK;
          renderAll();
          return;
        }

        if (action === "admin-toggle-all-suites") {
          const building = getBuilding(ui.admin.selectedBuildingId);
          if (!building) return;
          ui.admin.checkedSuiteIds =
            ui.admin.checkedSuiteIds.length === building.suites.length
              ? []
              : building.suites.map(function (suite) { return suite.id; });
          renderAll();
          return;
        }

        if (action === "admin-batch") {
          adminApplyBatch(target.dataset.mode);
          return;
        }

        if (action === "admin-save-building-review") {
          const building = getBuilding(ui.admin.selectedBuildingId);
          if (building) {
            building.reviewStatus = ui.admin.buildingReviewDraft;
            renderAll();
          }
          return;
        }

        if (action === "admin-save-suite") {
          const building = getBuilding(ui.admin.selectedBuildingId);
          const suite = getSuite(building, ui.admin.selectedSuiteId);
          if (suite) {
            suite.auditStatus = ui.admin.suiteAuditDraft;
            suite.status = ui.admin.suiteStatusDraft;
            suite.tenantDisplay = ui.admin.suiteDisplayDraft;
            suite.remark = ui.admin.suiteRemarkDraft;
            renderAll();
          }
        }
      });

      document.addEventListener("input", function (event) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.matches("[data-bind='broker-building']")) {
          ui.broker.buildingDraft[target.dataset.key] = target.value;
          return;
        }

        if (target.matches("[data-bind='broker-suite']")) {
          ui.broker.suiteDraft[target.dataset.key] = target.value;
          return;
        }

        if (target.matches("[data-bind='tenant']")) {
          ui.tenant[target.dataset.key] = target.value;
          return;
        }

        if (target.matches("[data-bind='admin-building']")) {
          ui.admin[target.dataset.key] = target.value;
          return;
        }

        if (target.matches("[data-bind='admin-suite']")) {
          ui.admin[target.dataset.key] = target.value;
        }
      });

      document.addEventListener("change", async function (event) {
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;

        if (target.matches("[data-bind='broker-building-array']")) {
          const key = target.dataset.key;
          ui.broker.buildingDraft[key] = toggleArrayValue(ui.broker.buildingDraft[key], target.value);
          renderAll();
          return;
        }

        if (target.matches("[data-bind='broker-suite-array']")) {
          const key = target.dataset.key;
          ui.broker.suiteDraft[key] = toggleArrayValue(ui.broker.suiteDraft[key], target.value);
          renderAll();
          return;
        }

        if (target.matches("[data-action='admin-toggle-suite-check']")) {
          const suiteId = target.dataset.suiteId;
          ui.admin.checkedSuiteIds = toggleArrayValue(ui.admin.checkedSuiteIds, suiteId);
          renderAll();
          return;
        }

        if (target.matches("[data-upload='broker-building-exterior']")) {
          const photos = await readFiles(target.files);
          ui.broker.buildingDraft.exteriorPhotos = ui.broker.buildingDraft.exteriorPhotos.concat(photos);
          renderAll();
          return;
        }

        if (target.matches("[data-upload='broker-building-doorplate']")) {
          const photos = await readFiles(target.files);
          ui.broker.buildingDraft.doorplatePhotos = ui.broker.buildingDraft.doorplatePhotos.concat(photos);
          renderAll();
          return;
        }

        if (target.matches("[data-upload='broker-suite-inside']")) {
          const photos = await readFiles(target.files);
          ui.broker.suiteDraft.insidePhotos = ui.broker.suiteDraft.insidePhotos.concat(photos);
          renderAll();
          return;
        }

        if (target.matches("[data-upload='broker-suite-door']")) {
          const photos = await readFiles(target.files);
          ui.broker.suiteDraft.doorPhotos = ui.broker.suiteDraft.doorPhotos.concat(photos);
          renderAll();
        }
      });

      window.addEventListener("hashchange", renderAll);
      ui.route = routeFromHash();
      renderAll();
