-- ==========================================
-- GL_CATEGORIES CRUD (MySQL 8+)
-- Table: gl_categories
-- Columns:
--  idGlCategorie INT AI PK
--  name VARCHAR(120)
--  nature ENUM('INCOME','EXPENSE','ADJUSTMENT','TRANSFER','OTHER')
--  is_active TINYINT
--  created_at DATETIME
-- ==========================================

DELIMITER $$

-- ---------- CREATE ----------
DROP PROCEDURE IF EXISTS sp_gl_categories_create $$
CREATE PROCEDURE sp_gl_categories_create(
  IN  p_name      VARCHAR(120),
  IN  p_nature    ENUM('INCOME','EXPENSE','ADJUSTMENT','TRANSFER','OTHER'),
  IN  p_is_active TINYINT,
  OUT p_idGlCategorie INT
)
BEGIN
  DECLARE v_exists INT DEFAULT 0;

  IF p_name IS NULL OR TRIM(p_name) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Name is required';
  END IF;

  IF p_is_active IS NULL THEN
    SET p_is_active = 1;
  END IF;

  IF p_is_active NOT IN (0,1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'is_active must be 0 or 1';
  END IF;

  -- Enforce uniqueness by name (case-sensitive depends on collation)
  SELECT COUNT(*)
    INTO v_exists
  FROM gl_categories
  WHERE name = TRIM(p_name)
  LIMIT 1;

  IF v_exists > 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category name already exists';
  END IF;

  INSERT INTO gl_categories (name, nature, is_active, created_at)
  VALUES (TRIM(p_name), p_nature, p_is_active, NOW());

  SET p_idGlCategorie = LAST_INSERT_ID();
END $$


-- ---------- READ (BY ID) ----------
DROP PROCEDURE IF EXISTS sp_gl_categories_get_by_id $$
CREATE PROCEDURE sp_gl_categories_get_by_id(
  IN p_idGlCategorie INT
)
BEGIN
  SELECT
    idGlCategorie,
    name,
    nature,
    is_active,
    created_at
  FROM gl_categories
  WHERE idGlCategorie = p_idGlCategorie;
END $$


-- ---------- LIST (WITH OPTIONAL FILTERS) ----------
DROP PROCEDURE IF EXISTS sp_gl_categories_list $$
CREATE PROCEDURE sp_gl_categories_list()
BEGIN
  SELECT
    idGlCategorie,
    name,
    nature,
    is_active,
    created_at
  FROM gl_categories
  WHERE
    is_active = 1;
END $$


-- ---------- UPDATE (PARTIAL) ----------
DROP PROCEDURE IF EXISTS sp_gl_categories_update $$
CREATE PROCEDURE sp_gl_categories_update(
  IN p_idGlCategorie INT,
  IN p_name          VARCHAR(120),
  IN p_nature        ENUM('INCOME','EXPENSE','ADJUSTMENT','TRANSFER','OTHER'),
  IN p_is_active     TINYINT
)
BEGIN
  DECLARE v_count  INT DEFAULT 0;
  DECLARE v_exists INT DEFAULT 0;

  SELECT COUNT(*)
    INTO v_count
  FROM gl_categories
  WHERE idGlCategorie = p_idGlCategorie;

  IF v_count = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category not found';
  END IF;

  IF p_name IS NOT NULL AND TRIM(p_name) = '' THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Name cannot be empty';
  END IF;

  IF p_is_active IS NOT NULL AND p_is_active NOT IN (0,1) THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'is_active must be 0 or 1';
  END IF;

  -- If name is being changed, enforce uniqueness
  IF p_name IS NOT NULL THEN
    SELECT COUNT(*)
      INTO v_exists
    FROM gl_categories
    WHERE name = TRIM(p_name)
      AND idGlCategorie <> p_idGlCategorie
    LIMIT 1;

    IF v_exists > 0 THEN
      SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category name already exists';
    END IF;
  END IF;

  UPDATE gl_categories
  SET
    name      = COALESCE(TRIM(p_name), name),
    nature    = COALESCE(p_nature, nature),
    is_active = COALESCE(p_is_active, is_active)
  WHERE idGlCategorie = p_idGlCategorie;
END $$


-- ---------- SOFT DELETE (DEACTIVATE) ----------
DROP PROCEDURE IF EXISTS sp_gl_categories_deactivate $$
CREATE PROCEDURE sp_gl_categories_deactivate(
  IN p_idGlCategorie INT
)
BEGIN
  UPDATE gl_categories
  SET is_active = 0
  WHERE idGlCategorie = p_idGlCategorie;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category not found';
  END IF;
END $$


-- ---------- ACTIVATE ----------
DROP PROCEDURE IF EXISTS sp_gl_categories_activate $$
CREATE PROCEDURE sp_gl_categories_activate(
  IN p_idGlCategorie INT
)
BEGIN
  UPDATE gl_categories
  SET is_active = 1
  WHERE idGlCategorie = p_idGlCategorie;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category not found';
  END IF;
END $$


-- ---------- HARD DELETE (OPTIONAL) ----------
-- Only if there are no FK references from gl_transaction_lines.
DROP PROCEDURE IF EXISTS sp_gl_categories_delete $$
CREATE PROCEDURE sp_gl_categories_delete(
  IN p_idGlCategorie INT
)
BEGIN
  DELETE FROM gl_categories
  WHERE idGlCategorie = p_idGlCategorie;

  IF ROW_COUNT() = 0 THEN
    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Category not found';
  END IF;
END $$

DELIMITER ;
