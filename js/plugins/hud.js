//=============================================================================
// BONCOS_HUD.js
//=============================================================================
/*:
 * @target MZ
 * @plugindesc HUD sederhana menampilkan Utang dan Saldo di layar map.
 * @author BONCOS
 *
 * @param varUtang
 * @text ID Variable Utang
 * @type variable
 * @default 2
 *
 * @param varSaldo
 * @text ID Variable Saldo
 * @type variable
 * @default 1
 *
 * @param switchAktif
 * @text ID Switch Penampil (kosongkan = selalu tampil)
 * @type switch
 * @default 0
 *
 * @help
 * Menampilkan kotak kecil di pojok kiri atas layar map berisi:
 * Utang dan Saldo — otomatis update tiap nilai variable berubah.
 *
 * Cara pasang:
 * 1. Taruh file ini di folder js/plugins/ project kamu.
 * 2. Buka Tools > Plugin Manager di editor RPG Maker MZ.
 * 3. Klik baris kosong, pilih plugin "BONCOS_HUD", set Status ON.
 * 4. Di parameter plugin, cocokkan ID Variable dengan nomor Utang dan
 *    Saldo yang sudah kamu buat sebelumnya (cek di Control Variables).
 * 5. Kalau mau HUD ini cuma muncul mulai level tertentu (misal setelah
 *    Level 3 selesai), isi "ID Switch Penampil" dengan nomor switch itu.
 *    Kalau dikosongkan (0), HUD akan selalu tampil dari awal game.
 */

(() => {
  const pluginName = "BONCOS_HUD";
  const params = PluginManager.parameters(pluginName);
  const varUtang = Number(params["varUtang"] || 2);
  const varSaldo = Number(params["varSaldo"] || 1);
  const switchAktif = Number(params["switchAktif"] || 0);

  function shouldShow() {
    if (switchAktif <= 0) return true;
    return $gameSwitches.value(switchAktif);
  }

  class Window_BoncosHUD extends Window_Base {
    initialize() {
      const width = 260;
      const height = 112;
      const rect = new Rectangle(8, 8, width, height);
      super.initialize(rect);
      this.opacity = 200;
      this.refresh();
    }

    update() {
      super.update();
      this.visible = shouldShow();
      if (this.visible) {
        this.refresh();
      }
    }

    refresh() {
      this.contents.clear();
      const utang = $gameVariables.value(varUtang);
      const saldo = $gameVariables.value(varSaldo);

      const lineHeight = this.lineHeight();
      this.changeTextColor(ColorManager.textColor(2));
      this.drawText("Utang", 0, 0 * lineHeight, 120, "left");
      this.resetTextColor();
      this.drawText(
        "Rp" + utang.toLocaleString("id-ID"),
        0,
        0 * lineHeight,
        this.contents.width,
        "right"
      );

      this.changeTextColor(ColorManager.textColor(3));
      this.drawText("Saldo", 0, 1 * lineHeight, 120, "left");
      this.resetTextColor();
      this.drawText(
        "Rp" + saldo.toLocaleString("id-ID"),
        0,
        1 * lineHeight,
        this.contents.width,
        "right"
      );
    }
  }

  const _Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
  Scene_Map.prototype.createAllWindows = function () {
    _Scene_Map_createAllWindows.call(this);
    this._boncosHudWindow = new Window_BoncosHUD();
    this.addWindow(this._boncosHudWindow);
  };
})();